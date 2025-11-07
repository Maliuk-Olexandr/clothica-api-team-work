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

router.use('/orders',authenticate);

router.get('/orders', getAllOrders);
router.get('/orders/:orderId', getOrderById);
router.post('/orders', createOrder);
router.patch('/orders/:orderId/status', updateOrderStatus);

export default router;
