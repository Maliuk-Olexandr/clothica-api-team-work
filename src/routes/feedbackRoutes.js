import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createFeedback,
  getFeedbacks,
} from '../controllers/feedbackController.js';
import { feedbackValidationSchema } from '../validations/feedbackValidation.js';

const router = Router();

router.get('/api/feedbacks', getFeedbacks);
router.post('/api/feedbacks', celebrate(feedbackValidationSchema), createFeedback);

export default router;
