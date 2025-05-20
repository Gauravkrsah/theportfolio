// Configure environment variables based on NODE_ENV
import * as dotenv from 'dotenv';
import path from 'path';

// Load appropriate .env file based on environment
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env' 
  : `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Log server startup information
console.log(`[INFO] Server starting in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`[INFO] Using environment file: ${envFile}`);

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes';
import geminiChatRoutes from './routes/geminiChat';
import validateConfig, { serverConfig } from './config';

// Validate configuration on startup
validateConfig();

const app = express();
const port = serverConfig.port;

// Middleware
app.use(cors());
app.use(express.json());

// Routes - handle both root paths and /api paths for flexibility
// This ensures the API works both when accessed directly and when accessed through URL rewriting
app.use('/', healthRoutes);
app.use('/api', healthRoutes);
app.use('/', geminiChatRoutes); 
app.use('/api', geminiChatRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});