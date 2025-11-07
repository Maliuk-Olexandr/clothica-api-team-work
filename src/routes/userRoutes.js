import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';
import {
  getCurrentUser,
  updateUser,
  // updateUserAvatar,
} from '../controllers/userController.js';
import { updateUserSchema } from '../validations/userValidation.js';
// import { upload } from '../middleware/multer.js';

const router = Router();

// router.patch(
//   '/users/me/avatar',
//   authenticate,
//   upload.single('avatar'),
//   updateUserAvatar,
// );

router.get('/users', authenticate, getCurrentUser);
router.patch('/users', authenticate, celebrate(updateUserSchema), updateUser);

export default router;
