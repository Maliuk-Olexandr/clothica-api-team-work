// routes/feedbackRoutes.js

import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createFeedback,
  getFeedbacks,
} from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/authenticate.js';
import { feedbackValidationSchema } from '../validations/feedbackValidation.js';

const router = Router();

router.get('/api/feedbacks', getFeedbacks);

// router.use(authenticate);

router.post(
  '/api/feedbacks',
  authenticate,celebrate(feedbackValidationSchema),
  createFeedback,
);

export default router;
