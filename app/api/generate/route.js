import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateSite } from '@/lib/claude';
import { createRepo } from '@/lib/github';
import { createProject, createApplication, deployApplication } from '@/lib/coolify';

var SERVER_UUID = 'hsgg40gscs8kcs8scwwko0ws';
var DEST_UUID = 'zgog0wg4wksoc44k840s0co0';

export async function POST(req) {
  var session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    var body = await req.json();
    var { prompt, name } = body;
    if (!prompt || !name) return NextResponse.json({ error: 'Prompt and name required' }, { status: 400 });
    var slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var repoName = 'kumo-' + slug;
    var files = await generateSite(prompt, name);
    var repoUrl = await createRepo(repoName, files);
    var project = await createProject({ name: name, description: name });
    var app = await createApplication({
      project_uuid: project.uuid, environment_name: 'production', server_uuid: SERVER_UUID, destination_uuid: DEST_UUID,
      type: 'public', name: name, description: name, git_repository: repoUrl, git_branch: 'main',
      build_pack: 'nixpacks', ports_exposes: '3000',
    });
    try { await deployApplication(app.uuid); } catch (e) { console.log('Deploy trigger:', e.message); }
    return NextResponse.json({ success: true, uuid: app.uuid, repository: repoUrl, application: app });
  } catch (err) { console.error('Generate error:', err); return NextResponse.json({ error: err.message }, { status: 500 }); }
}
