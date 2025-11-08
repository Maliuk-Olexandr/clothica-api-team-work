import Category from '../models/category.js';
import { CACHE_TTL } from '../constants/time.js';
import Good from '../models/good.js';

let cachedMeta = null;
let lastFetchTime = 0;

export const getFilterParams = async () => {
  const now = Date.now();

  // Якщо кеш існує і ще не протух — повертаємо його
  if (cachedMeta && now - lastFetchTime < CACHE_TTL) {
    return cachedMeta;
  }

  // Інакше — оновлюємо з бази
  const categories = await Category.find({}, '_id');
  const categoryIds = ['all', ...categories.map((c) => c._id.toString())];

  const [minGood] = await Good.find().sort({ 'price.value': 1 }).limit(1);
  const [maxGood] = await Good.find().sort({ 'price.value': -1 }).limit(1);

  const minPrice = minGood?.price?.value ?? 0;
  const maxPrice = maxGood?.price?.value ?? 0;

  cachedMeta = {
    categoryIds,
    minPrice,
    maxPrice,
  };
  lastFetchTime = now;

  return cachedMeta;
};
