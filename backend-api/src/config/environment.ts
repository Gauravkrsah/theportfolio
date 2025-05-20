/**
 * Environment configuration
 * Centralizes all environment variable access and provides defaults
 */

// Database configurations
export const dbConfig = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  dbPassword: process.env.SUPABASE_DB_PASSWORD || '',
  
  // Connection strings
  directConnection: process.env.DIRECT_CONNECTION || '',
  transactionPooler: process.env.TRANSACTION_POOLER || '',
  sessionPooler: process.env.SESSION_POOLER || '',
};

// Google API configurations
export const googleConfig = {
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
};

// Email configurations
export const emailConfig = {
  resendApiKey: process.env.RESEND_API_KEY || '',
};

// Server configurations
export const serverConfig = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiUrl: process.env.API_URL || 'http://localhost:4000/api',
  websiteUrl: process.env.WEBSITE_URL || 'http://localhost:8080',
};

// Validate required configuration for security
export const validateConfig = () => {
  const requiredConfigs = [
    { name: 'SUPABASE_URL', value: dbConfig.supabaseUrl },
    { name: 'SUPABASE_ANON_KEY', value: dbConfig.supabaseAnonKey },
    { name: 'GEMINI_API_KEY', value: googleConfig.geminiApiKey },
  ];
  
  const missingConfigs = requiredConfigs.filter(config => !config.value);
  
  if (missingConfigs.length > 0) {
    const missingNames = missingConfigs.map(config => config.name).join(', ');
    console.warn(`[WARNING] Missing required configuration: ${missingNames}`);
    if (serverConfig.isProduction) {
      throw new Error(`Missing required configuration in production: ${missingNames}`);
    }
  }
};
