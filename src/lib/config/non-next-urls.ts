import './env';

export const DATABASE_URL =
  process.env.OFFLINE === 'true'
    ? 'http://localhost:8080'
    : process.env.DATABASE_URL;

export const DATABASE_AUTH_TOKEN =
  process.env.OFFLINE === 'true' ? ' ' : process.env.DATABASE_AUTH_TOKEN;
