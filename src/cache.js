import Redis from "ioredis";

const cache = new Redis(process.env.REDIS_URL);

export default class Cache {
  static get = async (key) =>  {
    const value = await cache.get(key);
    return value ? JSON.parse(value) : null;
  }

  static set = async (key, value, ttl = null) => {
    if (!ttl) {
      await cache.set(key, JSON.stringify(value));
      return
    }

    await cache.set(key, JSON.stringify(value), "EX", ttl);
  }

  static delete = async (key) => {
    await cache.del(key);
  }

  static getClient = () => {
    return cache;
  }
}