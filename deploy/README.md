# Portfolio Project Deployment Guide

This document provides instructions for deploying the portfolio project to cPanel hosting.

## Project Structure

The project consists of two main parts:

1. **Frontend** - A Vite/React single-page application
2. **Backend API** - A Node.js Express API server

## Deployment Options

You have three options for deploying this project:

1. **Manual Deployment** - Upload files directly via cPanel File Manager
2. **Script-based Deployment** - Use the provided PowerShell scripts
3. **Automated CI/CD Deployment** - Use GitHub Actions for automatic deployment

## Prerequisites

- cPanel hosting account with:
  - Node.js support
  - SSH access (recommended)
  - FTP/SFTP access
- PM2 installed on your server (for running the Node.js backend)

## Option 1: Manual Deployment

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build:production
   ```

2. Upload the contents of `frontend/dist` to `public_html/website` on your cPanel account
   
3. Create a `.htaccess` file in `public_html/website` with the provided content in `deploy/templates/.htaccess.template`

### Backend Deployment

1. Build the backend:
   ```bash
   cd backend-api
   npm run build:production
   ```

2. Upload the following to `public_html/api` on your cPanel account:
   - `dist` folder
   - `package.json`
   - `ecosystem.config.json`
   - Copy `.env.production` to `.env`
   
3. Connect via SSH and run:
   ```bash
   cd public_html/api
   npm install --production
   pm2 start ecosystem.config.json
   pm2 save
   ```

## Option 2: Script-based Deployment

1. Edit deployment scripts with your cPanel credentials:
   - Update the `username` and `serverName` parameters in `deploy/scripts/*.ps1` files
   
2. Run the deployment script:
   ```powershell
   # Deploy everything to production
   npm run deploy:prod
   
   # Or deploy just frontend or backend
   .\deploy\scripts\deploy-frontend.ps1 -environment production -serverName "your-server.com" -username "your-username"
   .\deploy\scripts\deploy-backend.ps1 -environment production -serverName "your-server.com" -username "your-username"
   ```

## Option 3: GitHub Actions CI/CD

1. Add the following secrets to your GitHub repository:
   - `FTP_SERVER` - Your cPanel server (e.g., ftp.yourdomain.com)
   - `FTP_USERNAME` - Your cPanel username
   - `FTP_PASSWORD` - Your cPanel password
   - `SUPABASE_URL` - Your Supabase URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key 
   - `GEMINI_API_KEY` - Your Gemini API key
   
2. Push to the `main` branch or manually trigger the workflow in GitHub Actions

## cPanel Directory Structure

After deployment, your cPanel should have this structure:

```
public_html/
  website/        # Frontend files
    index.html
    assets/
    .htaccess
  api/            # Backend API
    dist/         # Compiled TypeScript
    node_modules/ # Dependencies
    .env          # Environment variables
    package.json
    ecosystem.config.json
    logs/         # PM2 logs
```

## Environment Management

- Development environment: `.env.development`
- Production environment: `.env.production`
- Local development: `.env` files are loaded based on NODE_ENV

## Troubleshooting

1. **Backend API not running:**
   - Check PM2 logs: `pm2 logs portfolio-api`
   - Ensure Node.js version compatibility

2. **Frontend not loading:**
   - Check browser console for errors
   - Verify API URL in environment variables
   - Confirm .htaccess file is properly set up

3. **Database connection issues:**
   - Verify Supabase credentials
   - Check for IP restrictions

4. **Deployment fails:**
   - Check FTP credentials and permissions
   - Ensure proper file paths in scripts

## Maintenance and Updates

To update the deployed site:
1. Make your code changes
2. Push to GitHub for automated deployment, or
3. Run deployment scripts manually
