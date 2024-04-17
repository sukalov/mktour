export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BASE_URL
    : 'http://localhost:3000';
    // : 'http://192.168.69.122:3000'
