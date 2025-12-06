#!/usr/bin/env bun

(process.env as Record<string, string>).NODE_ENV = 'test';
(process.env as Record<string, string>).MKTOURTEST = 'true';

async function runSeededTests() {
  const { seedComprehensiveTestData } = await import('../../server/db/seed');
  const { cleanupTestDb, getSeededTestData } = await import('./utils');

  console.log('setting up test database...');

  try {
    console.log('cleaning up test database...');
    await cleanupTestDb();
    console.log('🧹 test database cleaned up');

    console.log('seeding test database...');
    await seedComprehensiveTestData();
    console.log('🌱 test database seeded');

    const data = await getSeededTestData();
    console.log(
      `📊 seeded ${data.users.length} users, ${data.clubs.length} clubs, ${data.players.length} players`,
    );

    console.log('running tests...');
    Bun.spawn(
      ['bun', '--env-file=.env.local', 'test', ...process.argv.slice(3)],
      {
        stdio: ['inherit', 'inherit', 'inherit'],
        env: { ...process.env, NODE_ENV: 'test', MKTOURTEST: 'true' },
        onExit: (_, code) => {
          process.exit(code || 0);
        },
      },
    );
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

runSeededTests();
