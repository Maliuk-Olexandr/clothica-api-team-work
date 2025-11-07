// routes/feedbackRoutes.js

import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';


import {
  createFeedback,
  getFeedbacks,
} from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/authenticate.js';
import { feedbackValidationSchema } from '../validations/feedbackValidation.js';

const router = Router();

router.get('/', getFeedbacks);


router.use(authenticate);

router.post(
  '/',
  celebrate({ [Segments.BODY]: feedbackValidationSchema }),
  createFeedback,
);


export default router;
