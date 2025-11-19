import { openApiDocument } from '@/server/api/openapi';

export async function GET() {
  const openApiSpec = JSON.stringify(openApiDocument, null, 2);
  return new Response(openApiSpec, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
