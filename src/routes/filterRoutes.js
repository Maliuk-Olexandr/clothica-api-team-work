import express from 'express';

import { getFilterParamsCache } from '../utils/getFilterParamsCach.js';

const router = express.Router();

router.get('/api/filters', async (req, res) => {
  try {
    const filterMeta = await getFilterParamsCache();
    res.json(filterMeta);
  } catch (error) {
    console.error('Error fetching filter parameters:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
