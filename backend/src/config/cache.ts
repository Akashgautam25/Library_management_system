import NodeCache from 'node-cache';
import logger from './logger';

// In-memory cache — swap with ioredis for Redis in production
const nodeCache = new NodeCache({ stdTTL: 60, checkperiod: 120, useClones: false });

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = nodeCache.get<T>(key);
            return value !== undefined ? value : null;
        } catch (err) {
            logger.warn(`Cache GET error for key "${key}"`, { err });
            return null;
        }
    },

    async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
        try {
            nodeCache.set(key, value, ttlSeconds);
        } catch (err) {
            logger.warn(`Cache SET error for key "${key}"`, { err });
        }
    },

    async del(key: string): Promise<void> {
        try {
            nodeCache.del(key);
        } catch (err) {
            logger.warn(`Cache DEL error for key "${key}"`, { err });
        }
    },

    async flush(prefix: string): Promise<void> {
        try {
            const keys = nodeCache.keys().filter((k) => k.startsWith(prefix));
            if (keys.length) nodeCache.del(keys);
        } catch (err) {
            logger.warn(`Cache FLUSH error for prefix "${prefix}"`, { err });
        }
    },
};

// Cache key generators
export const CacheKeys = {
    books: (page: number, limit: number, sort: string, category: string, search: string) =>
        `books:${page}:${limit}:${sort}:${category}:${search}`,
    book: (id: string) => `book:${id}`,
    dashboardStats: () => `dashboard:stats`,
    bookCategories: () => `books:categories`,
};
