// app/api/auth/route.js
import { NextResponse } from 'next/server';
import { findUser, createUser, createToken, verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// POST /api/auth — login or signup
export async function POST(req) {
  try {
    const { action, email, password, name } = await req.json();

    if (action === 'signup') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'All fields required' }, { status: 400 });
      }
      if (findUser(email)) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = createUser({ name, email, password: hashed });
      const token = await createToken(user);

      const cookieStore = await cookies();
      cookieStore.set('kumo_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      }
      const user = findUser(email);
      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      const token = await createToken(user);

      const cookieStore = await cookies();
      cookieStore.set('kumo_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
    }

    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete('kumo_token');
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/auth — get current user
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('kumo_token')?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
