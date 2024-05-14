import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema',
  out: './src/lib/db/migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
