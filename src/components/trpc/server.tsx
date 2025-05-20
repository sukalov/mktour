import 'server-only'; // <-- ensure this file cannot be imported from the client

import { makeQueryClient } from '@/components/trpc/query-client';
import { appRouter } from '@/server/api';
import { createTRPCContext } from '@/server/api/trpc';
import { createTRPCClient } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { NextRequest } from 'next/server';
import { cache } from 'react';
import { devtoolsLink } from 'trpc-client-devtools-link';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: () =>
    createTRPCContext({ headers: new Headers(), req: {} as NextRequest }),
  router: appRouter,
  queryClient: getQueryClient,
});
// If your router is on a separate server, pass a client:
createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [
      devtoolsLink({
        enabled: process.env.NODE_ENV === 'development',
      }),
    ],
  }),
  queryClient: getQueryClient,
});
