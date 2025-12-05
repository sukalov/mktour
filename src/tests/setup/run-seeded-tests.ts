#!/usr/bin/env bun

import { seedComprehensiveTestData } from '../../server/db/seed';
import { cleanupTestDb } from './utils';

async function runSeededTests() {
  console.log('setting up test database...');

  try {
    // Seed the database
    console.log('cleaning up test database...');
    await cleanupTestDb();
    console.log('🧹 test database cleaned up');

    console.log('seeding test database...');
    await seedComprehensiveTestData();
    console.log('🌱 test database seeded');

    // Run the actual tests
    console.log('running tests...');
    Bun.spawn(
      ['bun', '--env-file=.env.local', 'test', ...process.argv.slice(3)],
      {
        env: { ...process.env, NODE_ENV: 'test' },
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
