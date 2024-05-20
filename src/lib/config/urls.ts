export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BASE_URL
    : 'http://192.168.1.27:3000';

export const SOCKET_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SOCKET_URL
    : 'ws://localhost:7070';
