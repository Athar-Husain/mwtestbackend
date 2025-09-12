import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// Load environment variables

// Import routes
import serviceAreaRoute from './routes/serviceAreaRoutes.js';
import customerRoute from './routes/CustomerRoutes.js';
import connectionRoute from './routes/ConnectionRoutes.js';
import teamRoute from './routes/teamRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import planRoutes from './routes/PlanRoutes.js';
import ticketRoutes from './routes/supportTicketRoutes.js';

// Import middlewares
import { errorHandler } from './middlewares/errorHandler.js';

// Initialize app
const app = express();

// Allow multiple origins for different client apps
const allowedOrigins = [
  process.env.CLIENT_CUSTOMER_URL,
  process.env.CLIENT_ADMIN_URL,
  process.env.CLIENT_TEAM_URL,
].filter(Boolean); // Remove undefined/null values

// console.log(process.env.CLIENT_CUSTOMER_URL);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Global middlewares
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// console.log('JWT_SECRET is:', process.env.JWT_SECRET);

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to MWFibernet API');
});

// Mount routes
app.use('/api/service-areas', serviceAreaRoute);
app.use('/api/customers', customerRoute);
app.use('/api/connections', connectionRoute);
app.use('/api/team', teamRoute);
app.use('/api/admin', adminRoute);
app.use('/api/plans', planRoutes);
app.use('/api/tickets', ticketRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found',
  });
});

// Global error handler
app.use(errorHandler);

export default app;
