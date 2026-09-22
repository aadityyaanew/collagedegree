import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';

function getAdminCredentials() {
  let username = process.env.ADMIN_USERNAME;
  let password = process.env.ADMIN_PASSWORD;

  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const userMatch = content.match(/^ADMIN_USERNAME\s*=\s*(.+)$/m);
      const passMatch = content.match(/^ADMIN_PASSWORD\s*=\s*(.+)$/m);
      if (userMatch && userMatch[1]) username = userMatch[1].trim();
      if (passMatch && passMatch[1]) password = passMatch[1].trim();
    }
  } catch (e) {
    // fallback
  }

  return {
    username: username || 'officialyvishal@gmail.com',
    password: password || 'Vishal#2026',
  };
}

export async function POST(request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'cd1091bd05861bc7dfd17f2c4b0c24e49a6a6a771dbe9902d922639bd15f2f10';
    const { username: ADMIN_USERNAME, password: ADMIN_PASSWORD } = getAdminCredentials();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const inputUsername = (username || '').trim().toLowerCase();
    const expectedUsername = ADMIN_USERNAME.trim().toLowerCase();

    if (inputUsername !== expectedUsername || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Create JWT token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ role: 'admin', username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .sign(secret);

    // Set cookie
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
