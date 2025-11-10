//---!!!----- кешування фільтрів товарів за допомогою Redis ---!!!---//
import { createClient } from 'redis';

import Category from '../models/category.js';
import Good from '../models/good.js';
// import Filter from '../models/filters.js';
import { CACHE_TTL } from '../constants/time.js';

let cachedMetaMemory = null; // fallback кеш в пам’яті
let lastFetchTime = 0;

let redisClient;
let redisConnected = false;
let redisReconnectedPause = false;
let redisInitInProgress = false;
// Ключ для збереження кешу в Redis
const CACHE_KEY = 'filterParamsCache';

async function initRedis() {
  if (redisInitInProgress) return;
  redisInitInProgress = true;
  if (redisClient && !redisClient.isOpen)
    try {
      await redisClient.quit();
    } catch {
      console.log('Error quitting redis client');
    }
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          if (!redisReconnectedPause) {
            console.error(
              'Redis reconnection failed after 10 attempts, pausing further attempts for 5 minutes.',
            );
            redisReconnectedPause = true;
            setTimeout(
              () => {
                redisReconnectedPause = false;
                console.log('Resuming Redis reconnection attempts.');
                initRedis().catch((err) => console.error('Error during Redis reconnection:', err)); // Спроба повторного підключення
              },
              5 * 60 * 1000, // пауза 5 хвилин
            );
          }
          return false;
        }
        return Math.min(retries * 500, 5000);
      },
    },
  });
  redisClient.on('connect', () => {
    redisConnected = true;
    redisInitInProgress = false;
    console.log('Redis reconnected ✅');
  });
  redisClient.on('ready', () => {
    console.log('Redis ready to use ✅');
  });
  redisClient.on('end', () => {
    if (redisConnected) {
      console.warn('Redis connection ended');
      redisConnected = false;
    }
  });
  redisClient.on('error', (err) => {
    if (redisConnected) {
      console.error('Redis connection lost', err.message);
      redisConnected = false;
      redisInitInProgress = false;
    }
  });
  process.on('SIGINT', async () => {
    if (redisClient && redisClient.isOpen) await redisClient.quit();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    if (redisClient && redisClient.isOpen) await redisClient.quit();
    process.exit(0);
  });
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Redis init error, fallback to memory cache:', error.message);
    redisConnected = false;
  } finally {
    redisInitInProgress = false;
  }
}

// Ініціалізуємо Redis клієнт
await initRedis();

// Основна функція отримання кешованих параметрів фільтрів
export const getFilterParamsCache = async () => {
  const now = Date.now();

  // спроба отримати кеш з Redis
  if (redisConnected) {
    try {
      const cachedData = await redisClient.get(CACHE_KEY);
      if (cachedData) return JSON.parse(cachedData);
    } catch (error) {
      console.error('Error fetching from Redis:', error);
    }
  }
  // fallback: перевірка кешу в пам’яті
  if (!redisConnected) {
    console.warn('Redis not connected, using memory cache fallback');
  }
  if (cachedMetaMemory && now - lastFetchTime < CACHE_TTL) {
    return cachedMetaMemory;
  }

  // Інакше — оновлюємо з бази
  const categories = await Category.find({}, '_id name').lean().exec();

  const [priceStats] = await Good.aggregate([
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price.value' },
        maxPrice: { $max: '$price.value' },
      },
    },
  ]);

  const meta = {
    categories: [{ _id: 'all', name: 'Усі' }, ...categories],
    minPrice: priceStats?.minPrice ?? 0,
    maxPrice: priceStats?.maxPrice ?? 0,
  };
  //  Оновлення Redis кешу
  if (redisConnected) {
    try {
      await redisClient.setEx(
        CACHE_KEY,
        CACHE_TTL / 1000,
        JSON.stringify(meta),
      );
    } catch (error) {
      console.error('Error saving to Redis:', error);
    }
  }
  // Оновлення локального кешу в пам’яті
  cachedMetaMemory = meta;
  lastFetchTime = now;

  return meta;
};

//---!!!--- ручне кешування фільтрів товарів ---!!!---//

// import Category from '../models/category.js';
// import Good from '../models/good.js';
// import { CACHE_TTL } from '../constants/time.js';

// let cachedMeta = null;
// let lastFetchTime = 0;
// export const getFilterParamsCache = async () => {
//   const now = Date.now();
//   // Якщо кеш існує і ще не протух — повертаємо його
//   if (cachedMeta && now - lastFetchTime < CACHE_TTL) {
//     return cachedMeta;
//   }
//   // Інакше — оновлюємо з бази
//   const categories = await Category.find({}, '_id');
//   const categoryIds = ['all', ...categories.map((c) => c._id.toString())];
//    const priceStats = await Good.aggregate([
//      {
//        $group: {
//          _id: null,
//          minPrice: { $min: '$price.value' },
//          maxPrice: { $max: '$price.value' },
//        },
//      },
//    ]);
//  const { minPrice, maxPrice } = priceStats[0] || {  };
//   cachedMeta = {categoryIds, minPrice, maxPrice};
//   lastFetchTime = now;
//   return cachedMeta;
// };
