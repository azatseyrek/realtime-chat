import { NextRequest, NextResponse } from 'next/server';
import { redis } from './lib/redis';
import { nanoid } from 'nanoid';

interface RoomMeta extends Record<string, unknown> {
  connected: string[];
  createdAt: number;
}

// check if prod
const isProd = process.env.NODE_ENV === 'production';

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  const roomMatch = pathname.match(/^\/room\/([^\/]+)(\/.*)?$/);
  if (!roomMatch) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  const roomId = roomMatch[1];
  const meta = await redis.hgetall<RoomMeta>(`meta:${roomId}`);

  if (!meta) {
    return NextResponse.redirect(new URL('/?error=room-not-found', req.url));
  }

  const existingToken = req.cookies.get('x-auth-token')?.value;

  //   USER ALREADY HAS TOKEN
  if (existingToken && meta.connected.includes(existingToken)) {
    return NextResponse.next();
  }

  //   USER IS NOT ALLOWED TO JOIN
  if (meta.connected.length >= 2) {
    return NextResponse.redirect(new URL('/?error=room-full', req.url));
  }

  const response = NextResponse.next();
  const token = nanoid();

  // Add user to connected list
  response.cookies.set('x-auth-token', token, { path: `/`, httpOnly: true, secure: !!isProd, sameSite: 'strict' });

  // Update connected users  meta.connected.push(token);
  await redis.hset(`meta:${roomId}`, {
    connected: [...(meta.connected || []), token],
  });

  return response;
};

export const config = {
  matcher: '/room/:path*',
};
