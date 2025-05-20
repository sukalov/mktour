/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { uncachedValidateRequest } from '@/lib/auth/lucia';
import { db } from '@/server/db';
import { getUserClubIds } from '@/server/queries/user-clubs';
import { getStatusInTournament } from '@/server/queries/get-status-in-tournament';
import { initTRPC, TRPCError } from '@trpc/server';
import { NextRequest } from 'next/server';
import superjson from 'superjson';
import { z, ZodError } from 'zod';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
  req: NextRequest;
}) => {
  const { session, user } = await uncachedValidateRequest();
  const clubs = user ? await getUserClubIds({ userId: user.id }) : [];
  return {
    session,
    user,
    clubs,
    db,
    headers: opts.headers,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` and `user` as non-nullable
      session: { ...ctx.session },
      user: { ...ctx.user },
    },
  });
});

export const clubAdminProcedure = protectedProcedure
  .input(z.object({ clubId: z.string() }))
  .use((opts) => {
    const isAdmin = opts.ctx.clubs.find(
      (clubId) => clubId === opts.input.clubId,
    );
    if (!isAdmin) {
      throw new TRPCError({
        code: 'FORBIDDEN',
      });
    }
    return opts.next();
  });

export const tournamentAdminProcedure = protectedProcedure
  .input(z.object({ tournamentId: z.string() }))
  .use(async (opts) => {
    const status = await getStatusInTournament(
      opts.ctx.user.id,
      opts.input.tournamentId,
    );
    if (status !== 'organizer') {
      throw new TRPCError({
        code: 'FORBIDDEN',
      });
    }
    return opts.next();
  });

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
export type ProtectedTRPCContext = TRPCContext & {
  user: NonNullable<TRPCContext['user']>;
  session: NonNullable<TRPCContext['session']>;
};
