import { Router } from 'express';
import { celebrate } from 'celebrate';

import { createSubscriptionSchema } from '../validations/subscriptionsValidation.js';
import { createSubscription } from '../controllers/subscriptionsController.js';

const router = Router();

router.post(
  '/api/subscriptions',
  celebrate(createSubscriptionSchema),
  createSubscription,
);

export default router;
