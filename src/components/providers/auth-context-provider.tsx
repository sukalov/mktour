'use client';

import { useUser } from '@/components/hooks/query-hooks/use-user';
import {
  AuthContext,
  AuthContextType,
} from '@/components/providers/auth-context';
import { FC, PropsWithChildren } from 'react';

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: user } = useUser();

  // FIXME add queries to match type
  const userClubs = undefined;
  const affiliatedPlayers = undefined;

  const value: AuthContextType = { user, userClubs, affiliatedPlayers };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
