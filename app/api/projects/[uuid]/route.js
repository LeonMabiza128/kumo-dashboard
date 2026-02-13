// app/api/projects/[uuid]/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  getApplication, updateApplication, deleteApplication,
  deployApplication, listDeployments, getApplicationLogs
} from '@/lib/coolify';

// GET /api/projects/:uuid
export async function GET(req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { uuid } = await params;
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    if (action === 'deployments') {
      const deployments = await listDeployments(uuid).catch(() => []);
      return NextResponse.json({ deployments: Array.isArray(deployments) ? deployments : [] });
    }

    if (action === 'logs') {
      const lines = url.searchParams.get('lines') || 100;
      const logs = await getApplicationLogs(uuid, lines).catch(() => '');
      return NextResponse.json({ logs });
    }

    const app = await getApplication(uuid);
    return NextResponse.json({ application: app });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/projects/:uuid — update
export async function PATCH(req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { uuid } = await params;
  try {
    const data = await req.json();
    const updated = await updateApplication(uuid, data);
    return NextResponse.json({ application: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/projects/:uuid — deploy
export async function POST(req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { uuid } = await params;
  try {
    const result = await deployApplication(uuid);
    return NextResponse.json({ deployment: result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/projects/:uuid
export async function DELETE(req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { uuid } = await params;
  try {
    await deleteApplication(uuid);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
