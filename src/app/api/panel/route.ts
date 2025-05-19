import { appRouter } from '@/server';
import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  const { renderTrpcPanel } = await import('trpc-ui');

  return new NextResponse(
    renderTrpcPanel(appRouter, {
      url: '/api/trpc',
      transformer: 'superjson',
    }),
    {
      status: 200,
      headers: [['Content-Type', 'text/html'] as [string, string]],
    },
  );
}
