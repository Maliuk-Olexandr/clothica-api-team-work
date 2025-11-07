import { Router } from 'express';
import { celebrate } from 'celebrate';

import { getAllGoodsSchema } from '../validations/goodsValidation.js';
import { getAllGoodes } from '../controllers/goodsController.js';

const router = Router();

router.get('/goods', celebrate(getAllGoodsSchema), getAllGoodes);
// router.get('/goods/:goodId', celebrate(noteIdSchema), getNoteById);

export default router;
