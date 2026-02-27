import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getApplication, updateApplication, deleteApplication, deployApplication, getDeployments } from '@/lib/coolify';

export async function GET(req, { params }) {
  var session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    var p = await params;
    var app = await getApplication(p.uuid);
    var deployments = [];
    try { deployments = await getDeployments(p.uuid); } catch (e) {}
    return NextResponse.json({ application: app, deployments: Array.isArray(deployments) ? deployments : [] });
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}

export async function PATCH(req, { params }) {
  var session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    var p = await params;
    var body = await req.json();
    if (body.action === 'deploy') { var result = await deployApplication(p.uuid); return NextResponse.json({ success: true, result: result }); }
    var updated = await updateApplication(p.uuid, body);
    return NextResponse.json(updated);
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}

export async function DELETE(req, { params }) {
  var session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { var p = await params; await deleteApplication(p.uuid); return NextResponse.json({ success: true }); }
  catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
