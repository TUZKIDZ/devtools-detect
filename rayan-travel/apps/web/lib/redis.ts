import Redis from 'ioredis'
import { logger } from './logger'

const globalForRedis = globalThis as unknown as { redis: Redis }

function createRedisClient() {
  const client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    lazyConnect: true,
  })
  client.on('error', (err) => logger.error('Redis error', { err: err.message }))
  return client
}

export const redis = globalForRedis.redis ?? createRedisClient()
if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key)
    return cached ? (JSON.parse(cached) as T) : null
  } catch {
    return null
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number) {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch (err) {
    logger.warn('Redis set failed', { key, err: String(err) })
  }
}

export const TTL = {
  HOTELS: 900,
  FLIGHTS: 600,
  TOURS: 1800,
  CARS: 1800,
} as const
