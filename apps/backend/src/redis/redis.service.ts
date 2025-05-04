import { Injectable, Logger } from '@nestjs/common';

import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      connectTimeout: 10000, // 10 seconds
      reconnectOnError: (err) => {
        this.logger.error(`Redis connection error: ${err.message}`, err.stack);
        return true; // Reconnect for all errors
      },
      retryStrategy: (times) => {
        this.logger.warn(`Redis reconnection attempt ${times}`);
        return Math.min(times * 100, 3000); // Exponential backoff with max 3s
      },
    });

    this.redis.on('error', (err) => {
      this.logger.error(`Redis error: ${err.message}`, err.stack);
    });

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  async hset(key: string, data: Record<string, any>): Promise<void> {
    try {
      await this.redis.hset(key, data);
    } catch (error) {
      this.logger.error(
        `Redis hset error for key ${key}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async rpush(key: string, value: string): Promise<void> {
    try {
      await this.redis.rpush(key, value);
    } catch (error) {
      this.logger.error(
        `Redis rpush error for key ${key}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.redis.lrange(key, start, stop);
    } catch (error) {
      this.logger.error(
        `Redis lrange error for key ${key}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await this.redis.hgetall(key);
    } catch (error) {
      this.logger.error(
        `Redis hgetall error for key ${key}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
