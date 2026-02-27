import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { listDatabases } from '@/lib/coolify';

export async function GET() {
  var session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { var dbs = await listDatabases(); return NextResponse.json(dbs); }
  catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
