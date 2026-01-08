(process.env as Record<string, string>).NODE_ENV = 'test';
(process.env as Record<string, string>).MKTOURTEST = 'true';

const { seedComprehensiveTestData } = await import('../../server/db/seed');
const { cleanupTestDb } = await import('./utils');

console.log('cleaning up test database...');
await cleanupTestDb();
console.log('🧹 test database cleaned up');

console.log('seeding test database...');
await seedComprehensiveTestData();
console.log('🌱 test database seeded');

export {};
