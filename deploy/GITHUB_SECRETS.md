# GitHub Actions Secrets Reference

This file provides a reference for all the secrets required to set up GitHub Actions deployment for this project.

## Required Secrets

When setting up GitHub Actions for automated deployment of this project, you need to add the following secrets to your GitHub repository:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `FTP_SERVER` | Your cPanel server hostname | `ftp.yourdomain.com` |
| `FTP_USERNAME` | Your cPanel username | `username` |
| `FTP_PASSWORD` | Your cPanel password | `password123` (use a strong password!) |
| `SUPABASE_URL` | Your Supabase project URL | `https://azuayjwlelviircskqjk.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `GEMINI_API_KEY` | Your Google Gemini API key | `AIzaSyAj0IlBxZUnskZLEvmzZUQQLObMRqGiJjE` |

## How to add secrets to your GitHub repository

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" > "Actions"
4. Click on "New repository secret"
5. Enter the name and value of the secret
6. Click "Add secret"
7. Repeat for each secret listed above

## Security Notes

- Never commit these secrets directly to your code
- Regularly rotate your API keys and passwords
- Use the principle of least privilege when assigning permissions

## URLs in the Workflow

The GitHub Actions workflow automatically configures deployment URLs based on the environment:

- **Production URLs:**
  - API URL: `https://gauravsah.com.np/api`
  - Website URL: `https://gauravsah.com.np`
  - Gemini API Endpoint: `https://gauravsah.com.np/api/gemini-chat`

- **Development URLs:**
  - API URL: `http://localhost:4000/api`
  - Website URL: `http://localhost:8080`
  - Gemini API Endpoint: `http://localhost:4000/api/gemini-chat`

If you need to customize these URLs, edit the `deploy.yml` file in the `.github/workflows` directory.
