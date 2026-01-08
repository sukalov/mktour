import './env';

export const getDatabaseUrl = () =>
  process.env.OFFLINE === 'true'
    ? 'http://localhost:8080'
    : process.env.MKTOURTEST === 'true' || process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL;

export const getDatabaseAuthToken = () =>
  process.env.OFFLINE === 'true'
    ? ' '
    : process.env.MKTOURTEST === 'true' || process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_AUTH_TOKEN
      : process.env.DATABASE_AUTH_TOKEN;

export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
export const TEST_DATABASE_AUTH_TOKEN = process.env.TEST_DATABASE_AUTH_TOKEN;
