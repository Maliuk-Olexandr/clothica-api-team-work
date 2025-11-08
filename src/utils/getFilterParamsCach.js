//---!!!----- кешування фільтрів товарів за допомогою Redis ---!!!---//
import { createClient } from 'redis';

import Category from '../models/category.js';
import Good from '../models/good.js';
import { CACHE_TTL } from '../constants/time.js';


// Ініціалізуємо Redis клієнт
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});
redisClient.on('error', (err) => console.error('Redis error:', err));
await redisClient.connect();
// Ключ для збереження кешу в Redis
const CACHE_KEY = 'filterParamsCache';
//
export const getFilterParamsCache = async () => {
  const now = Date.now();
  // Перевіряємо кеш у Redis
  const cachedData = await redisClient.get(CACHE_KEY);
  // Якщо кеш існує і не прострочений, повертаємо його
  if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    const { timestamp, data } = parsedData;
    if (now - timestamp < CACHE_TTL) {
      return data;
    }
  }
  // Інакше — оновлюємо з бази
  const categories = await Category.find({}, '_id').lean().exec();
  const categoryIds = ['all', ...categories.map((c) => c._id.toString())];

  const priceStats = await Good.aggregate([
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price.value' },
        maxPrice: { $max: '$price.value' },
      },
    },
  ]);
  const { minPrice = 0, maxPrice = 0 } = priceStats[0] || {};
  const meta = {
    categoryIds,
    minPrice,
    maxPrice,
  };
  // Зберігаємо оновлений кеш у Redis
  await redisClient.setEx(CACHE_KEY, CACHE_TTL / 1000, JSON.stringify(meta));
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
