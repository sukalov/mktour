// src/app/[...trpc]/route.ts
import { appRouter } from '@/server/api';
import { createTRPCContext } from '@/server/api/trpc';
import { type NextRequest } from 'next/server';
import { createOpenApiFetchHandler } from 'trpc-to-openapi';

const handler = (req: NextRequest) => {
  // Handle incoming OpenAPI requests
  return createOpenApiFetchHandler({
    endpoint: '/api',
    router: appRouter,
    createContext: () => createTRPCContext({ headers: new Headers(), req }),
    req,
  });
};

export {
  handler as DELETE,
  handler as GET,
  handler as HEAD,
  handler as OPTIONS,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
