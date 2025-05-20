# Quick Start Guide

This guide provides quick steps to get your portfolio project deployed.

## Initial Setup

1. Configure your environment files:
   - Copy `.env.example` to `.env.development` and `.env.production`
   - Fill in the required values in each file

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend-api && npm install
   cd ..
   ```

## Local Development

Run the entire project locally:
```bash
npm run dev
```

This will start:
- Frontend at http://localhost:8080
- Backend API at http://localhost:4000

## Deployment

### Option 1: Deploy from your local machine

1. Edit the deployment scripts with your cPanel credentials:
   - Update `username` and `serverName` in `/deploy/scripts/*.ps1` files

2. Deploy to production:
   ```bash
   npm run deploy:prod
   ```

   Or deploy to development:
   ```bash
   npm run deploy:dev
   ```

### Option 2: Set up GitHub Actions CI/CD

1. Push your code to GitHub

2. Add required secrets to your GitHub repository
   (see `deploy/GITHUB_SECRETS.md` for details)

3. Push to the `main` branch to trigger deployment

## Testing Your Deployment

After deployment:

1. Visit your website: `https://yourdomain.com`
2. Test API endpoints: `https://yourdomain.com/api/health`
3. Check PM2 status on your server:
   ```bash
   ssh username@yourdomain.com
   cd public_html/api
   pm2 status
   ```

## Additional Resources

- Full deployment guide: `deploy/README.md`
- GitHub Actions secrets reference: `deploy/GITHUB_SECRETS.md`
- Troubleshooting guide: See `Troubleshooting` section in `deploy/README.md`
