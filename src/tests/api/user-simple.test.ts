import { publicCaller } from '@/server/api/index';
import { beforeAll, describe, expect, it } from 'bun:test';
import { getSeededTestData } from '../setup/utils';

describe('User Router - Simple Test', () => {
  let testData: Awaited<ReturnType<typeof getSeededTestData>>;

  // Get seeded data once - global setup handles seeding
  beforeAll(async () => {
    testData = await getSeededTestData();
  });

  it('should return user info by ID', async () => {
    const result = await publicCaller.user.info({
      userId: testData.firstUser.id,
    });

    expect(result).toBeDefined();
    expect(result?.username).toBe(testData.firstUser.username);
    expect(result?.rating).toBe(testData.firstUser.rating);
  });

  it('should return multiple users', async () => {
    const result = await publicCaller.user.all();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
