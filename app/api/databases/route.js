// app/api/databases/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { listDatabases, createDatabase, deleteDatabase } from '@/lib/coolify';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const databases = await listDatabases().catch(() => []);
    return NextResponse.json({ databases: Array.isArray(databases) ? databases : [] });
  } catch (err) {
    return NextResponse.json({ error: err.message, databases: [] }, { status: 200 });
  }
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const db = await createDatabase(data);
    return NextResponse.json({ database: db });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
