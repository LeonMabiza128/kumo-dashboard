// lib/auth.js — Simple JWT auth for Kumo
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'kumo-secret-2026');
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
}

export function getUsers() {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function findUser(email) {
  return getUsers().find(u => u.email === email.toLowerCase());
}

export function createUser({ name, email, password }) {
  const users = getUsers();
  const user = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    name,
    email: email.toLowerCase(),
    password, // Already hashed
    plan: 'pro',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export async function createToken(user) {
  return new SignJWT({ id: user.id, email: user.email, name: user.name, plan: user.plan })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('kumo_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
