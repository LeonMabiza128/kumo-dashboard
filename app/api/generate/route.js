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
    // Try to fix truncated JSON by closing open strings and braces
    var fixed = text;
    // Count open braces
    var openBraces = (fixed.match(/{/g) || []).length;
    var closeBraces = (fixed.match(/}/g) || []).length;
    // If we're inside a string value, close it
    if (fixed.lastIndexOf('"') > fixed.lastIndexOf('":')) {
      // We might be in a truncated string
      fixed = fixed + '"';
    }
    // Close any open braces
    for (var i = 0; i < openBraces - closeBraces; i++) {
      fixed = fixed + '}';
    }
    try {
      files = JSON.parse(fixed);
    } catch (e2) {
      // Last resort: extract whatever complete key-value pairs we have
      files = extractPartialJSON(text);
      if (!files || Object.keys(files).length === 0) {
        throw new Error('Failed to parse generated code. Try a simpler description.');
      }
    }
  }

  // Ensure package.json exists
  if (!files['package.json']) {
    files['package.json'] = JSON.stringify({
      name: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      version: '1.0.0',
      private: true,
      scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
      dependencies: { next: '^15.0.0', react: '^19.0.0', 'react-dom': '^19.0.0' }
    }, null, 2);
  }

  // Ensure next.config.js exists
  if (!files['next.config.js'] && !files['next.config.mjs']) {
    files['next.config.js'] = 'const nextConfig = {};\nmodule.exports = nextConfig;\n';
  }

  return files;
}

function extractPartialJSON(text) {
  var files = {};
  // Match "filepath": "content" patterns
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
      // Find the last quote before the next key
      var nextKeyStart = positions[i + 1].start;
      var segment = text.substring(start, nextKeyStart);
      var lastQuote = segment.lastIndexOf('"');
      if (lastQuote > 0) {
        end = start + lastQuote;
      } else {
        continue;
      }
    } else {
      // Last entry - find the closing quote
      var remaining = text.substring(start);
      var lastQ = remaining.lastIndexOf('"');
      if (lastQ > 0) {
        end = start + lastQ;
      } else {
        end = text.length;
      }
    }

    var content = text.substring(start, end);
    // Unescape the content
    try {
      content = JSON.parse('"' + content + '"');
    } catch (e) {
      content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    files[positions[i].key] = content;
  }

  return files;
}

async function createGithubRepo(repoName, files) {
  var createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': 'token ' + GITHUB_TOKEN,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      name: repoName,
      private: false,
      auto_init: false,
      description: 'Generated by Kumo AI',
    }),
  });

  if (!createRes.ok) {
    var err = await createRes.json();
    if (!(err.errors && err.errors[0] && err.errors[0].message === 'name already exists on this account')) {
      throw new Error('GitHub repo creation failed: ' + JSON.stringify(err));
    }
  }

  var fileEntries = Object.entries(files);
  var treeItems = [];

  for (var i = 0; i < fileEntries.length; i++) {
    var filePath = fileEntries[i][0];
    var content = fileEntries[i][1];
    if (typeof content !== 'string') content = JSON.stringify(content, null, 2);

    var blobRes = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/git/blobs', {
      method: 'POST',
      headers: {
        'Authorization': 'token ' + GITHUB_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: content, encoding: 'utf-8' }),
    });

    if (!blobRes.ok) throw new Error('Failed to create blob for ' + filePath);
    var blob = await blobRes.json();

    treeItems.push({ path: filePath, mode: '100644', type: 'blob', sha: blob.sha });
  }

  var gitignoreBlob = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/git/blobs', {
    method: 'POST',
    headers: {
      'Authorization': 'token ' + GITHUB_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: 'node_modules\n.next\n.env\n.env.local\n', encoding: 'utf-8' }),
  }).then(function(r) { return r.json(); });

  treeItems.push({ path: '.gitignore', mode: '100644', type: 'blob', sha: gitignoreBlob.sha });

  var treeRes = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/git/trees', {
    method: 'POST',
    headers: {
      'Authorization': 'token ' + GITHUB_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tree: treeItems }),
  });

  if (!treeRes.ok) throw new Error('Failed to create tree');
  var tree = await treeRes.json();

  var commitRes = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/git/commits', {
    method: 'POST',
    headers: {
      'Authorization': 'token ' + GITHUB_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Generated by Kumo AI', tree: tree.sha }),
  });

  if (!commitRes.ok) throw new Error('Failed to create commit');
  var commit = await commitRes.json();

  var refRes = await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/git/refs', {
    method: 'POST',
    headers: {
      'Authorization': 'token ' + GITHUB_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref: 'refs/heads/main', sha: commit.sha }),
  });

  if (!refRes.ok) {
    await fetch('https://api.github.com/repos/' + GITHUB_USER + '/' + repoName + '/git/refs/heads/main', {
      method: 'PATCH',
      headers: {
        'Authorization': 'token ' + GITHUB_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sha: commit.sha, force: true }),
    });
  }

  return 'https://github.com/' + GITHUB_USER + '/' + repoName;
}
