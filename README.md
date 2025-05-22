# Personal Portfolio Website

A modern, full-stack portfolio website built with React, TypeScript, and Express. This project showcases professional experience, projects, blog posts, and includes an admin dashboard for content management.

![Portfolio](https://img.shields.io/badge/Portfolio-2025-blue)
![Tech Stack](https://img.shields.io/badge/Tech_Stack-React_TypeScript_Express-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Security](https://img.shields.io/badge/Security-Environment_Variables-red)

## 📋 Features

- **Responsive Design**: Fully optimized for all devices using Tailwind CSS
- **Interactive UI**: Built with React, TypeScript and Shadcn UI components
- **Blog Platform**: Share your thoughts and technical expertise
- **Project Showcase**: Display your work with detailed project pages
- **Admin Dashboard**: Manage content with a secure admin interface
- **AI Integration**: Gemini AI integration for chat functionality
- **SEO Optimized**: Scripts for sitemap generation, SEO validation, and more
- **Authentication**: Secure admin access with Firebase/Supabase authentication

## 🛠️ Tech Stack

### Frontend:
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI)
- **State Management**: React Context API
- **Routing**: React Router
- **Data Fetching**: TanStack React Query
- **Animation**: Framer Motion

### Backend:
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **AI Integration**: Google's Generative AI (Gemini)

### DevOps & Tools:
- **SEO Tools**: Custom scripts for sitemap generation and SEO validation
- **Image Optimization**: Automatic image optimization
- **Prerendering**: Static page generation for improved performance

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Environment Setup
   - Create a `.env` file in the backend directory with the following:
   ```
   PORT=4000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key
   ```
   
   - Create a `.env.local` file in the frontend directory:
   ```
   VITE_FIREBASE_API_KEY=your_new_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
   
   > ⚠️ **Security Note**: Never commit .env files to version control. Make sure they are listed in your .gitignore file.

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:4000`.

## 📁 Project Structure

```
portfolio/
├── backend/                # Express backend API
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── scripts/            # SEO and optimization scripts
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── admin/      # Admin dashboard components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── sections/   # Page sections
│   │   │   └── ui/         # Reusable UI components
│   │   ├── contexts/       # React context definitions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and services
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
│
└── docs/                   # Documentation
```

## 🧩 Key Components

- **Hero Section**: Engaging introduction with animations
- **Projects Section**: Showcasing your best work
- **Blog Section**: Share your thoughts and expertise
- **Contact Form**: Allow visitors to reach out
- **Admin Dashboard**: Manage all content in one place
- **AI Chat**: Interactive chat with AI assistance

## 🌟 Deployment

### Building for Production

1. Build the frontend
```bash
cd frontend
npm run build:prod
```

2. Build the backend
```bash
cd backend
npm run build:prod
```

### Deployment Options

- **Frontend**: Vercel, Netlify, or any static hosting service
- **Backend**: Heroku, AWS, DigitalOcean, or any Node.js hosting service

## 📊 SEO and Performance

This portfolio comes with built-in tools for SEO optimization:

- `npm run generate:sitemap`: Generates a sitemap for search engines
- `npm run generate:prerender`: Pre-renders static HTML for better SEO
- `npm run optimize:images`: Optimizes images for faster loading
- `npm run validate:seo`: Validates structured data for search engines
- `npm run check:seo`: Checks overall SEO status

## 🔒 Security Best Practices

This project implements several security best practices to protect sensitive information:

### Environment Variables
All API keys and sensitive credentials are stored as environment variables:

#### Frontend (.env.local file)
```
VITE_FIREBASE_API_KEY=your_new_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Backend (.env file)
```
PORT=4000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
```

### Security Guidelines

1. **Never commit .env files** to your repository
2. **Add .env files to .gitignore**
3. **Rotate API keys regularly**, especially after accidental exposure
4. **Use environment-specific variables** for different deployment environments
5. **Implement rate limiting** for API endpoints
6. **Validate all user inputs** to prevent injection attacks
7. **Use proper authentication** for admin areas
8. **Enable CORS with specific origins** in production

### Secret Scanning
- Configure GitHub secret scanning to detect accidentally committed secrets
- Follow the GitHub remediation steps if a secret is exposed:
  1. Rotate the secret immediately
  2. Revoke the exposed key through the service provider
  3. Check security logs for potential breaches
  4. Close the alert as revoked

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Your Name - [hello@gauravsah.com.np](mailto:hello@gauravsah.com.np)

Project Link: [https://github.com/Gauravkrsah/theportfolio](https://github.com/Gauravkrsah/theportfolio)

---

© 2025 Your Name. All Rights Reserved.
