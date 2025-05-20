// Configure environment variables based on NODE_ENV
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Simplified environment loading - always prioritize .env
const mainEnvPath = path.resolve(process.cwd(), '.env');

// Check if main .env file exists
if (fs.existsSync(mainEnvPath)) {
  dotenv.config({ path: mainEnvPath });
  console.log(`[INFO] Loaded environment from: .env`);
} else {
  console.warn(`[WARN] No .env file found at ${mainEnvPath}`);
  dotenv.config(); // Try to load from default location
}

// Log environment variables that are critical for operation
const mode = process.env.NODE_ENV || 'development';
console.log(`[INFO] Server starting in ${mode} mode`);
console.log(`[INFO] GEMINI_API_KEY present: ${Boolean(process.env.GEMINI_API_KEY)}`);
console.log(`[INFO] API will run on port: ${process.env.PORT || 4000}`);

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