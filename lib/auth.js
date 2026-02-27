import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

var SECRET = process.env.JWT_SECRET || 'kumo-secret-2026';
var DATA_DIR = path.join(process.cwd(), 'data');
var USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
}

export function getUsers() { ensureDataDir(); return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); }
export function saveUsers(users) { ensureDataDir(); fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); }
export function findUser(email) { return getUsers().find(function(u) { return u.email === email; }); }
export function createUser(user) { var users = getUsers(); users.push(user); saveUsers(users); return user; }
export function signToken(payload) { return jwt.sign(payload, SECRET, { expiresIn: '7d' }); }
export function verifyToken(token) { try { return jwt.verify(token, SECRET); } catch (e) { return null; } }

export async function getSession() {
  try {
    var cookieStore = await cookies();
    var token = cookieStore.get('kumo_token');
    if (!token) return null;
    return verifyToken(token.value);
  } catch (e) { return null; }
}

export async function setSession(payload) {
  var token = signToken(payload);
  var cookieStore = await cookies();
  cookieStore.set('kumo_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
  return token;
}

export async function clearSession() { var cookieStore = await cookies(); cookieStore.delete('kumo_token'); }
