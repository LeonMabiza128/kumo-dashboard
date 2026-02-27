import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { listApplications, createProject, createApplication, deployApplication } from '@/lib/coolify';

var SERVER_UUID = 'hsgg40gscs8kcs8scwwko0ws';
var DEST_UUID = 'zgog0wg4wksoc44k840s0co0';

export async function GET() {
  var session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { var apps = await listApplications(); return NextResponse.json(apps); }
  catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}

export async function POST(req) {
  var session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    var body = await req.json();
    var { name, repository, branch } = body;
    if (!name || !repository) return NextResponse.json({ error: 'Name and repository required' }, { status: 400 });
    var project = await createProject({ name: name, description: name });
    var app = await createApplication({
      project_uuid: project.uuid, environment_name: 'production', server_uuid: SERVER_UUID, destination_uuid: DEST_UUID,
      type: 'public', name: name, description: name, git_repository: repository, git_branch: branch || 'main',
      build_pack: 'nixpacks', ports_exposes: '3000',
    });
    try { await deployApplication(app.uuid); } catch (e) { console.log('Deploy:', e.message); }
    return NextResponse.json(app);
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
