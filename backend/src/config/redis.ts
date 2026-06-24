import Redis from 'ioredis';
import { ENV } from './env';

let redis: Redis | null = null;

if (ENV.REDIS_URL) {
  redis = new Redis(ENV.REDIS_URL, {
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
    maxRetriesPerRequest: 3,
  });
  redis.on('error', (err) => console.error('Redis error:', err));
  redis.on('connect', () => console.log('✅ Redis connected'));
}

export { redis };

export async function cacheGet(key: string): Promise<string | null> {
  if (!redis) return null;
  return redis.get(key);
}

export async function cacheSet(key: string, value: string, ttl = 300): Promise<void> {
  if (!redis) return;
  await redis.setex(key, ttl, value);
}

export async function cacheDel(key: string): Promise<void> {
  if (!redis) return;
  await redis.del(key);
}
