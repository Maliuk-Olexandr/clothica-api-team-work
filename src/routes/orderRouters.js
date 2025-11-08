import { Router } from 'express';
// import { celebrate } from 'celebrate';

import { createOrder, getAllOrders, getOrderById,updateOrderStatus } from '../controllers/orderController.js';
// import {
//   getAllNotesSchema,
//   noteIdSchema,
//   createNoteSchema,
//   updateNoteSchema,
// } from '../validations/notesValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use('/api/orders',authenticate);

router.get('/api/orders', getAllOrders);
router.get('/api/orders/:orderId', getOrderById);
router.post('/api/orders', createOrder);
router.patch('/api/orders/:orderId/status', updateOrderStatus);

export default router;
