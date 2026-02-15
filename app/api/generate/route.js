import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createProject, createApplication, deployApplication } from '@/lib/coolify';

var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
var GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
var GITHUB_USER = process.env.GITHUB_USERNAME || '';
var SERVER_UUID = 'hsgg40gscs8kcs8scwwko0ws';
var DEST_UUID = 'zgog0wg4wksoc44k840s0co0';

export async function POST(req) {
  var session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    var body = await req.json();
    var prompt = body.prompt;
    var projectName = body.name || 'ai-site';
    var slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var repoName = 'kumo-' + slug;

    var files = await generateWithClaude(prompt, projectName);
    var repoUrl = await createGithubRepo(repoName, files);
    var project = await createProject({ name: projectName, description: projectName });
    var app = await createApplication({
      project_uuid: project.uuid,
      environment_name: 'production',
      server_uuid: SERVER_UUID,
      destination_uuid: DEST_UUID,
      type: 'public',
      name: projectName,
      description: projectName,
      git_repository: repoUrl,
      git_branch: 'main',
      build_pack: 'nixpacks',
      ports_exposes: '3000',
    });

    try { await deployApplication(app.uuid); } catch (e) { console.log('Deploy trigger:', e.message); }

    return NextResponse.json({
      success: true,
      application: app,
      repository: repoUrl,
      uuid: app.uuid,
    });
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function generateWithClaude(prompt, name) {
  var systemPrompt = [
    "You generate Next.js websites. Return ONLY a valid JSON object.",
    "Keys are file paths, values are file contents as strings.",
    "CRITICAL RULES:",
    "- Keep ALL code compact. No comments. Minimal whitespace.",
    "- Use ONLY inline styles in JSX. No separate CSS files except globals.css.",
    "- globals.css should be under 30 lines.",
    "- page.js should be ONE file with all sections. No separate components.",
    "- Maximum 5 files total: package.json, next.config.js, app/layout.js, app/page.js, app/globals.css",
    "- Use Next.js App Router.",
    "- Make it look modern and professional with a dark theme.",
    "- Include real placeholder content, not lorem ipsum.",
    "- All strings in JSON values must escape quotes properly.",
    "- Return valid JSON only. No markdown. No backticks. No explanation.",
  ].join("\n");

  var res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: 'Create a website: ' + prompt + '\n\nProject: ' + name + '\n\nReturn ONLY valid JSON. Max 5 files. Keep code compact.'
        }
      ],
      system: systemPrompt,
    }),
  });

  if (!res.ok) {
    var errText = await res.text();
    throw new Error('Claude API error: ' + errText);
  }

  var data = await res.json();
  var text = data.content[0].text;
  text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  var files;
  try {
    files = JSON.parse(text);
  } catch (e) {
    var fixed = text;
    var openBraces = (fixed.match(/{/g) || []).length;
    var closeBraces = (fixed.match(/}/g) || []).length;
    if (fixed.lastIndexOf('"') > fixed.lastIndexOf('":')) {
      fixed = fixed + '"';
    }
    for (var i = 0; i < openBraces - closeBraces; i++) {
      fixed = fixed + '}';
    }
    try {
      files = JSON.parse(fixed);
    } catch (e2) {
      files = extractPartialJSON(text);
      if (!files || Object.keys(files).length === 0) {
        throw new Error('Failed to parse generated code. Try a simpler description.');
      }
    }
  }

  if (!files['package.json']) {
    files['package.json'] = JSON.stringify({
      name: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      version: '1.0.0',
      private: true,
      scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
      dependencies: { next: '^15.0.0', react: '^19.0.0', 'react-dom': '^19.0.0' }
    }, null, 2);
  }

  if (!files['next.config.js'] && !files['next.config.mjs']) {
    files['next.config.js'] = 'const nextConfig = {};\nmodule.exports = nextConfig;\n';
  }

  return files;
}

function extractPartialJSON(text) {
  var files = {};
  var regex = /"([^"]+\.[a-z]{1,4})"\s*:\s*"/g;
  var match;
  var positions = [];
  while ((match = regex.exec(text)) !== null) {
    positions.push({ key: match[1], start: match.index + match[0].length });
  }
  for (var i = 0; i < positions.length; i++) {
    var start = positions[i].start;
    var end;
    if (i + 1 < positions.length) {
      var nextKeyStart = positions[i + 1].start;
      var segment = text.substring(start, nextKeyStart);
      var lastQuote = segment.lastIndexOf('"');
      if (lastQuote > 0) { end = start + lastQuote; } else { continue; }
    } else {
      var remaining = text.substring(start);
      var lastQ = remaining.lastIndexOf('"');
      if (lastQ > 0) { end = start + lastQ; } else { end = text.length; }
    }
    var content = text.substring(start, end);
    try { content = JSON.parse('"' + content + '"'); } catch (e) {
      content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    files[positions[i].key] = content;
  }
  return files;
}

function ghHeaders() {
  return {
    'Authorization': 'token ' + GITHUB_TOKEN,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
  };
}

function toBase64(str) {
  return Buffer.from(str, 'utf-8').toString('base64');
}

async function createGithubRepo(repoName, files) {
  // Step 1: Create repo with auto_init
  var createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: ghHeaders(),
    body: JSON.stringify({
      name: repoName,
      private: false,
      auto_init: true,
      description: 'Generated by Kumo AI',
    }),
  });

  if (!createRes.ok) {
    var err = await createRes.json();
    if (!(err.errors && err.errors[0] && err.errors[0].message === 'name already exists on this account')) {
      throw new Error('GitHub repo creation failed: ' + JSON.stringify(err));
    }
  }

  // Step 2: Wait for GitHub to initialize
  var ready = false;
  for (var attempt = 0; attempt < 10; attempt++) {
    await new Promise(function(resolve) { setTimeout(resolve, 1500); });
    var checkRes = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/contents/', {
      headers: ghHeaders(),
    });
    if (checkRes.ok) {
      ready = true;
      break;
    }
  }

  if (!ready) {
    throw new Error('GitHub repo not ready after initialization. Please try again.');
  }

  // Step 3: Upload files using Contents API (simpler, works immediately)
  var fileEntries = Object.entries(files);

  for (var i = 0; i < fileEntries.length; i++) {
    var filePath = fileEntries[i][0];
    var content = fileEntries[i][1];
    if (typeof content !== 'string') content = JSON.stringify(content, null, 2);

    // Check if file exists (to get sha for update)
    var existRes = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/contents/' + filePath, {
      headers: ghHeaders(),
    });

    var putBody = {
      message: 'Add ' + filePath,
      content: toBase64(content),
      branch: 'main',
    };

    if (existRes.ok) {
      var existData = await existRes.json();
      putBody.sha = existData.sha;
    }

    var putRes = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/contents/' + filePath, {
      method: 'PUT',
      headers: ghHeaders(),
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      var putErr = await putRes.text();
      throw new Error('Failed to upload ' + filePath + ': ' + putErr);
    }
  }

  // Step 4: Add .gitignore
  var giBody = {
    message: 'Add .gitignore',
    content: toBase64('node_modules\n.next\n.env\n.env.local\n'),
    branch: 'main',
  };
  var giExist = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/contents/.gitignore', {
    headers: ghHeaders(),
  });
  if (giExist.ok) {
    var giData = await giExist.json();
    giBody.sha = giData.sha;
  }
  await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/contents/.gitignore', {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify(giBody),
  });

  return 'https://github.com/' + GITHUB_USER + '/' + repoName;
}
