import { getOpenApiDocument } from '@/server/api/openapi';

console.log(JSON.stringify(getOpenApiDocument(), null, 2));
