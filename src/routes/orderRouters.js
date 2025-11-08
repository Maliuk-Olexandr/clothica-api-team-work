import { Router } from 'express';
import { celebrate } from 'celebrate';

import { createOrder, getAllOrders, getOrderById,updateOrderStatus } from '../controllers/orderController.js';
import {
 orderIdSchema,
 createOrderSchema,
  updateOrderStatusSchema,
 getAllOrdersSchema,
} from '../validations/orderValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/api/orders', celebrate(getAllOrdersSchema), getAllOrders);
router.get('/api/orders/:orderId', celebrate(orderIdSchema), getOrderById);
router.post('/api/orders', celebrate(createOrderSchema), createOrder);
router.patch('/api/orders/:orderId/status', celebrate(updateOrderStatusSchema), updateOrderStatus);

export default router;
