import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '@/lib/config/non-next-urls';
import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/server/db/schema',
  out: './src/server/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
} satisfies Config);
