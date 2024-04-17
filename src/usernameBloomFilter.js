import crypto from 'crypto';
import log from "./log.js";
import Cache from "./cache.js";

export class UsernameBloomFilter {
  static #cache_key = "username_bloom_filter_key";
  static #size = 10_000_000;

  static has = async (username) => {
    log.info('UsernameBloomFilter::has', { username })

    const indexes = this.#getIndexesFromHashing(username);
    const found_result_bits = await Promise.all(indexes.map(async (index) => {
        const get = await Cache.getClient().getbit(this.#cache_key, index);
        return get
      })
    );
    const found = found_result_bits.every(bit => bit === 1);
    return found
  }

  static add = async (username) => {
    log.info('UsernameBloomFilter::add', { username })

    const indexes = this.#getIndexesFromHashing(username);
    await Promise.all(indexes.map(async (index) => {
      const add = await Cache.getClient().setbit(this.#cache_key, index, 1);
      return add
    }));
  }

  static #getIndexesFromHashing(username) {
    const indexes = [];

    indexes.push(this.#sha256(username));
    indexes.push(this.#fnvHash(username));

    return indexes
  }

  static #sha256(username) {
    const hashedUsername = crypto.createHash('sha256').update(username).digest('hex');
    const hashedInt = parseInt(hashedUsername, 16);
    return hashedInt % this.#size;
  }

  static #fnvHash(username) {
    const FNV_PRIME = 16777619;
    const OFFSET_BASIS = 2166136261;
    let hash = OFFSET_BASIS;

    for (let i = 0; i < username.length; i++) {
      hash ^= username.charCodeAt(i);
      hash *= FNV_PRIME;
    }

    const unsigned = hash >>> 0;

    return unsigned % this.#size;
  }

  static printMemoryUsage = async () => {
    const result = await Cache.getBitSize(this.#cache_key);
    console.log(result / 1_000_000, 'MB')
  }

  static clear = async () => {
    await Cache.delete(this.#cache_key);
  }
}