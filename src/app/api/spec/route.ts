import { getOpenApiDocument } from '@/server/api/openapi';

export async function GET() {
  const openApiSpec = JSON.stringify(getOpenApiDocument(), null, 2);
  return new Response(openApiSpec, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
