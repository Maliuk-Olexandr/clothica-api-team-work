import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getAllGoodsSchema,
  goodIdSchema,
} from '../validations/goodsValidation.js';
import { getAllGoods, getGoodById } from '../controllers/goodsController.js';

const router = Router();

router.get('/api/goods', async (req, res, next) => {
  const schema = await getAllGoodsSchema();
  return celebrate(schema)(req, res, next);
}, getAllGoods);
router.get('/api/goods/:goodId', celebrate(goodIdSchema), getGoodById);

export default router;
