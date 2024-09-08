export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BASE_URL
    : 'http://localhost:3000';
    // : 'http://localhost:3000';

export const SOCKET_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SOCKET_URL
    : 'ws://localhost:7070';

export const DATABASE_URL =
  process.env.OFFLINE === 'true'
    ? 'http://localhost:8080'
    : process.env.DATABASE_URL;

export const DATABASE_AUTH_TOKEN =
  process.env.OFFLINE === 'true' ? ' ' : process.env.DATABASE_AUTH_TOKEN;
