import { NextResponse } from 'next/server';

export async function GET() {
  const response = new NextResponse(null, { status: 200 });

  response.cookies.set('show_new_user_toast', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  return response;
}
