import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUser, createUser, setSession } from '@/lib/auth';

export async function POST(req) {
  try {
    var body = await req.json();
    var { name, email, password } = body;
    if (!name || !email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (findUser(email)) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    var hash = await bcrypt.hash(password, 10);
    var user = { id: Date.now().toString(), name: name, email: email, password: hash, createdAt: new Date().toISOString() };
    createUser(user);
    await setSession({ id: user.id, name: user.name, email: user.email });
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
