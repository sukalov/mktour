import './env';

export const DATABASE_URL =
  process.env.OFFLINE === 'true'
    ? 'http://localhost:8080'
    : process.env.TEST === 'true' || process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL;

export const DATABASE_AUTH_TOKEN =
  process.env.OFFLINE === 'true'
    ? ' '
    : process.env.TEST === 'true' || process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_AUTH_TOKEN
      : process.env.DATABASE_AUTH_TOKEN;
