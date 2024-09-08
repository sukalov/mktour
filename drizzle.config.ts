import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '@/lib/config/urls';
import type { Config } from "drizzle-kit";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema',
  out: './src/lib/db/migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
} satisfies Config);
