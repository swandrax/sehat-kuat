import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

export interface VelocityResult {
  count: number;
  totalAmount: number;
  exceeded: boolean;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;

  // In-memory fallback cache for development or when Redis instance is unreachable
  private memCache = new Map<string, { val: string; expiresAt?: number }>();
  private memVelocity = new Map<string, { count: number; totalAmount: number; expiresAt: number }>();

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.client = new Redis(redisUrl, {
        lazyConnect: true,
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('Redis retry limit reached. Continuing with in-memory state engine.');
            return null;
          }
          return Math.min(times * 100, 1000);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log('🚀 Redis cluster connected successfully for caching & FDS velocity limits');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection failed (${err.message}). Using resilient in-memory state engine.`);
      });

      await this.client.connect().catch(() => {
        this.isConnected = false;
        this.logger.warn('Redis daemon not running on localhost:6379. In-memory state acceleration active.');
      });
    } catch (e: any) {
      this.isConnected = false;
      this.logger.warn(`Redis init error (${e.message}). Falling back to memory state engine.`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        // ignore on shutdown
      }
    }
  }

  isRedisConnected(): boolean {
    return this.isConnected;
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch {
        // fallback
      }
    }

    const item = this.memCache.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memCache.delete(key);
      return null;
    }
    return item.val;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch {
        // fallback
      }
    }

    this.memCache.set(key, {
      val: value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  async del(key: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch {
        // fallback
      }
    }
    this.memCache.delete(key);
  }

  /**
   * Atomic SETNX for Idempotency Keys and Distributed Locks
   */
  async setnx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    if (this.isConnected && this.client) {
      try {
        const result = await this.client.set(key, value, 'EX', ttlSeconds, 'NX');
        return result === 'OK';
      } catch {
        // fallback
      }
    }

    const now = Date.now();
    const existing = this.memCache.get(key);
    if (existing && (!existing.expiresAt || existing.expiresAt > now)) {
      return false;
    }
    this.memCache.set(key, {
      val: value,
      expiresAt: now + ttlSeconds * 1000,
    });
    return true;
  }

  /**
   * Velocity limit tracking for FDS (Fraud Detection System)
   * Tracks count and cumulative amount in sliding window
   */
  async recordVelocity(
    key: string,
    windowSeconds: number,
    amount: number = 0,
    maxAllowedCount: number = 5,
    maxAllowedAmount: number = 50000000,
  ): Promise<VelocityResult> {
    if (this.isConnected && this.client) {
      try {
        const countKey = `fds:count:${key}`;
        const amountKey = `fds:amt:${key}`;

        const newCount = await this.client.incr(countKey);
        if (newCount === 1) {
          await this.client.expire(countKey, windowSeconds);
        }

        const rawAmount = await this.client.incrbyfloat(amountKey, amount);
        const newAmount = parseFloat(rawAmount) || 0;
        if (newCount === 1) {
          await this.client.expire(amountKey, windowSeconds);
        }

        const exceeded = newCount > maxAllowedCount || newAmount > maxAllowedAmount;
        return {
          count: newCount,
          totalAmount: newAmount,
          exceeded,
        };
      } catch {
        // fallback
      }
    }

    const now = Date.now();
    let entry = this.memVelocity.get(key);
    if (!entry || entry.expiresAt <= now) {
      entry = {
        count: 1,
        totalAmount: amount,
        expiresAt: now + windowSeconds * 1000,
      };
    } else {
      entry.count += 1;
      entry.totalAmount += amount;
    }
    this.memVelocity.set(key, entry);

    const exceeded = entry.count > maxAllowedCount || entry.totalAmount > maxAllowedAmount;
    return {
      count: entry.count,
      totalAmount: entry.totalAmount,
      exceeded,
    };
  }

  async getVelocity(key: string): Promise<{ count: number; totalAmount: number }> {
    if (this.isConnected && this.client) {
      try {
        const count = parseInt((await this.client.get(`fds:count:${key}`)) || '0', 10);
        const totalAmount = parseFloat((await this.client.get(`fds:amt:${key}`)) || '0');
        return { count, totalAmount };
      } catch {
        // fallback
      }
    }

    const entry = this.memVelocity.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
      return { count: 0, totalAmount: 0 };
    }
    return { count: entry.count, totalAmount: entry.totalAmount };
  }
}
