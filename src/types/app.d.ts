// app.d.ts
/// <reference types="lucia" />

import { LichessUser } from '@lucia-auth/oauth/providers';

declare namespace Lucia {
  type Auth = import('@/lib/auth/lucia').Auth;

  type LuciaDatabaseUserAttributes = {
    name: string;
    username: string;
    email: string;
  };
  type DatabaseSessionAttributes = {};
}
