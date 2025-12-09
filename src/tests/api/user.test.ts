/* eslint-disable @typescript-eslint/no-explicit-any */
import { publicCaller } from '@/server/api/index';
import { clubsSelectSchema } from '@/server/db/zod/clubs';
import {
  usersSelectPublicSchema,
  usersSelectSchema,
} from '@/server/db/zod/users';
import { beforeAll, describe, expect, it } from 'bun:test';

import { getSeededTestData } from '../setup/utils';

describe('user router', () => {
  let testData: Awaited<ReturnType<typeof getSeededTestData>>;

  beforeAll(async () => {
    testData = await getSeededTestData();
  });

  describe('user.all', () => {
    it('validates output schema', async () => {
      const result = await publicCaller.user.all();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Validate against expected schema (id, username, name)
      const expectedSchema = usersSelectSchema.pick({
        username: true,
        name: true,
        id: true,
      });
      result.forEach((user) => {
        const parseResult = expectedSchema.safeParse(user);
        expect(parseResult.success).toBe(true);
      });
    });

    it('returns data', async () => {
      const result = await publicCaller.user.all();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeDefined();
    });
  });

  describe('user.info', () => {
    it('validates output schema', async () => {
      const result = await publicCaller.user.info({
        userId: testData.firstUser.id,
      });

      expect(result).toBeDefined();

      // Validate against expected schema (username, name, rating)
      const expectedSchema = usersSelectSchema.pick({
        username: true,
        name: true,
        rating: true,
      });
      if (result) {
        const parseResult = expectedSchema.safeParse(result);
        expect(parseResult.success).toBe(true);
      }
    });

    it('returns null for non-existent user', async () => {
      const result = await publicCaller.user.info({
        userId: 'non-existent-user-id',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('user.infoByUsername', () => {
    it('validates output schema', async () => {
      const result = await publicCaller.user.infoByUsername({
        username: testData.firstUser.username,
      });

      expect(result).toBeDefined();

      // Validate against public schema (all fields except email)
      const parseResult = usersSelectPublicSchema.safeParse(result);
      expect(parseResult.success).toBe(true);
    });

    it('throws not_found for non-existent username', async () => {
      expect(
        publicCaller.user.infoByUsername({
          username: 'nonexistentuser123',
        }),
      ).rejects.toThrow('NOT_FOUND');
    });

    it('is case sensitive', async () => {
      const username = testData.firstUser.username;

      const exactResult = await publicCaller.user.infoByUsername({
        username: username,
      });
      expect(exactResult).toBeDefined();

      expect(
        publicCaller.user.infoByUsername({
          username: username.toUpperCase(),
        }),
      ).rejects.toThrow('NOT_FOUND');
    });
  });

  describe('user.clubs', () => {
    it('validates output schema', async () => {
      const result = await publicCaller.user.clubs({
        userId: testData.firstUser.id,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Validate against expected schema (id, name)
      const expectedSchema = clubsSelectSchema.pick({ id: true, name: true });
      result.forEach((club) => {
        const parseResult = expectedSchema.safeParse(club);
        expect(parseResult.success).toBe(true);
      });
    });

    it('handles non-existent user id', async () => {
      const result = await publicCaller.user.clubs({
        userId: 'non-existent-user-id',
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('handles malformed input', () => {
      expect(
        publicCaller.user.info({ userId: undefined as any }),
      ).rejects.toThrow();

      expect(
        publicCaller.user.infoByUsername({ username: undefined as any }),
      ).rejects.toThrow();

      expect(
        publicCaller.user.clubs({ userId: undefined as any }),
      ).rejects.toThrow();
    });

    it('handles special characters in username', async () => {
      const specialUser = testData.users.find(
        (u) => u.username && /[^\w]/.test(u.username),
      );

      if (specialUser) {
        const result = await publicCaller.user.infoByUsername({
          username: specialUser.username,
        });
        expect(result).toBeDefined();
        expect(result?.username).toBe(specialUser.username);
      }
    });

    it('handles concurrent requests', async () => {
      const promises = [
        publicCaller.user.all(),
        publicCaller.user.info({ userId: testData.firstUser.id }),
        publicCaller.user.clubs({ userId: testData.firstUser.id }),
      ];

      const results = await Promise.all(promises);

      results.forEach((result) => {
        expect(result).toBeDefined();
      });
    });

    it('maintains data consistency between endpoints', async () => {
      const userId = testData.firstUser.id;

      const infoResult = await publicCaller.user.info({ userId });
      const allUsersResult = await publicCaller.user.all();
      const userFromAll = allUsersResult.find((u) => u.id === userId);

      expect(infoResult?.username).toBe(userFromAll?.username);
      expect(infoResult?.name).toBe(userFromAll?.name);
    });
  });
});
