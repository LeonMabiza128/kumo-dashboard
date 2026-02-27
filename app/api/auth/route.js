import { NextResponse } from 'next/server';
import { getSession, clearSession } from '@/lib/auth';

export async function GET() {
  var session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  return NextResponse.json({ user: session });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ success: true });
}
