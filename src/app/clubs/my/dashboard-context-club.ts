import { AppRouter } from '@/server/api';
import { UseQueryResult } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import { inferRouterOutputs } from '@trpc/server';
import { createContext } from 'react';

export const ClubDashboardContext =
  createContext<ClubDashboardContextType>(undefined);

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type ClubDashboardContextType =
  | UseQueryResult<
      RouterOutputs['club']['notifications'],
      TRPCClientErrorLike<AppRouter>
    >
  | undefined;
