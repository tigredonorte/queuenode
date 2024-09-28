export const redisConfig = {
  host: process.env.REDIS_HOST || '',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
}
