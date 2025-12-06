const fs = await import('fs');
const path = await import('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

envContent.split('\n').forEach((line) => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    (process.env as Record<string, string>)[key.trim()] = value
      .trim()
      .replace(/^["']|["']$/g, '');
  }
});

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
