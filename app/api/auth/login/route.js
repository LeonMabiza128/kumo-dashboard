import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUser, setSession } from '@/lib/auth';

export async function POST(req) {
  try {
    var body = await req.json();
    var { email, password } = body;
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    var user = findUser(email);
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    var valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    await setSession({ id: user.id, name: user.name, email: user.email });
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
