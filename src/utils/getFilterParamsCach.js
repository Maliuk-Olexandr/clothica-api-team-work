//---!!!----- кешування фільтрів товарів за допомогою Redis ---!!!---//
import { createClient } from 'redis';

import Category from '../models/category.js';
import Good from '../models/good.js';
import { CACHE_TTL } from '../constants/time.js';

let cachedMetaMemory = null; // fallback кеш в пам’яті
let lastFetchTime = 0;

let redisClient;
let redisConnected = false;

// Ініціалізуємо Redis клієнт
try {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  });
  redisClient.on('error', (err) => {
    console.error('Redis connection lost', err.message);
    redisConnected = false;
  });

  await redisClient.connect();
  redisConnected = true;
  console.log('Redis connected ✅');
} catch (error) {
  console.error('Redis init error, fallback to memory cache:', error.message);
}
// Ключ для збереження кешу в Redis
const CACHE_KEY = 'filterParamsCache';

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
  if (cachedMetaMemory && now - lastFetchTime < CACHE_TTL) {
    return cachedMetaMemory;
  }

  // Інакше — оновлюємо з бази
  const categories = await Category.find({}, '_id').lean().exec();
  const categoryIds = ['all', ...categories.map((c) => c._id.toString())];

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
    categoryIds,
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
