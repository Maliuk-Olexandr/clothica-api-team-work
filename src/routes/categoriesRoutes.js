// library imports
import { Router } from 'express';
import { celebrate } from 'celebrate';

// import controller
import { getAllCategories } from '../controllers/categoriesController.js';
// import validation schema
import { getAllCategoriesSchema } from '../validations/categoriesValidation.js';

const router = Router();

router.get('/api/categories', celebrate(getAllCategoriesSchema), getAllCategories);

export default router;
