import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import goodsRoutes from './routes/goodsRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import subscriptionsRoutes from './routes/subscriptionsRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(logger);

// public routes
app.use(categoriesRoutes);
app.use(goodsRoutes);
app.use(feedbackRoutes);
app.use(subscriptionsRoutes);

// protected routes
app.use(authRoutes);
app.use(orderRoutes);
app.use(userRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
export default app;
