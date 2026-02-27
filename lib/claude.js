var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

var SYSTEM_PROMPT = `You generate Next.js 15 websites. Return ONLY a valid JSON object.
Keys are file paths, values are file contents as strings.

CRITICAL RULES:
- Maximum 5 files: package.json, next.config.js, app/layout.js, app/page.js, app/globals.css
- page.js is ONE file with ALL sections. No imports of local components.
- Use ONLY inline styles in JSX. globals.css is minimal (body reset, fonts only).
- Keep code compact. No comments. Minimal whitespace in code.
- Use Next.js App Router with "use client" on page.js.
- Modern, professional dark theme design.
- Real placeholder content relevant to the business, not lorem ipsum.
- Properly escape all quotes inside JSON string values.
- Return valid JSON only. No markdown fences. No backticks. No explanation text.
- package.json must have: next@^15.0.0, react@^19.0.0, react-dom@^19.0.0
- next.config.js: just module.exports = {};
- In layout.js use metadata export with title and description.
- Make sure the website has: navigation, hero section, features/services, and footer.`;

export async function generateSite(prompt, projectName) {
  var res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 12000, system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: 'Create a website for: ' + prompt + '\nProject name: ' + projectName + '\nReturn ONLY valid JSON. Max 5 files. Compact code.' }],
    }),
  });
  if (!res.ok) { var errText = await res.text(); throw new Error('Claude API error: ' + errText); }

  var data = await res.json();
  var text = data.content[0].text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  var files;
  try { files = JSON.parse(text); } catch (e) { files = tryFixJSON(text); }

  var slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (!files['package.json']) {
    files['package.json'] = JSON.stringify({ name: slug, version: '1.0.0', private: true,
      scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
      dependencies: { next: '^15.0.0', react: '^19.0.0', 'react-dom': '^19.0.0' } }, null, 2);
  }
  if (!files['next.config.js'] && !files['next.config.mjs']) { files['next.config.js'] = 'module.exports = {};'; }
  return files;
}

function tryFixJSON(text) {
  var fixed = text;
  var openB = (fixed.match(/{/g) || []).length;
  var closeB = (fixed.match(/}/g) || []).length;
  var lastQ = fixed.lastIndexOf('"');
  var lastCQ = fixed.lastIndexOf('":');
  if (lastQ > lastCQ + 2) fixed = fixed + '"';
  for (var i = 0; i < openB - closeB; i++) fixed = fixed + '}';
  try { return JSON.parse(fixed); } catch (e) {}

  var files = {};
  var regex = /"([^"]+\.[a-z]{1,5})"\s*:\s*"/g;
  var match; var positions = [];
  while ((match = regex.exec(text)) !== null) { positions.push({ key: match[1], start: match.index + match[0].length }); }
  for (var i = 0; i < positions.length; i++) {
    var start = positions[i].start; var endIdx;
    if (i + 1 < positions.length) {
      var seg = text.substring(start, positions[i + 1].start);
      var lq = seg.lastIndexOf('"');
      if (lq > 0) endIdx = start + lq; else continue;
    } else { var rem = text.substring(start); var lq2 = rem.lastIndexOf('"'); endIdx = lq2 > 0 ? start + lq2 : text.length; }
    var val = text.substring(start, endIdx);
    try { val = JSON.parse('"' + val + '"'); } catch (e) { val = val.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\'); }
    files[positions[i].key] = val;
  }
  if (Object.keys(files).length === 0) throw new Error('Could not parse AI response. Try a simpler description.');
  return files;
}
