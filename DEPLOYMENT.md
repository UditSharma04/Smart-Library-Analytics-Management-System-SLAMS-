# Deployment Guide

This guide will help you deploy the VIT Chennai Library Management System to production using Vercel (frontend) and Render (backend).

## Prerequisites

1. **MongoDB Atlas Account**: Create a MongoDB Atlas cluster for production database
2. **Cloudinary Account**: For image uploads and storage
3. **Vercel Account**: For frontend deployment
4. **Render Account**: For backend deployment
5. **Stripe Account** (Optional): If using payment features

## Backend Deployment (Render)

### Step 1: Prepare Your Repository

1. Push your code to GitHub/GitLab
2. Ensure your `server` directory is at the root or properly configured

### Step 2: Create a Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `libathon-backend`
   - **Region**: Choose nearest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables

In Render dashboard, add these environment variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/libathon_production

# JWT Secret (generate a strong secret)
JWT_SECRET=your_super_secret_jwt_key_here

# Port (Render will set this automatically, but you can specify)
PORT=5000

# Environment
NODE_ENV=production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Origins (replace with your Vercel domain)
CORS_ORIGINS=https://your-app-name.vercel.app,https://libathon.vercel.app

# Database Seeding (set to true for first deployment, then false)
SEED_DATABASE=true

# Stripe (if using payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Your backend will be available at: `https://your-service-name.onrender.com`

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Ensure your `client` directory has the proper configuration
2. Update the API URL in your environment variables

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
cd client
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: Using GitHub Integration

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables in Vercel

In Vercel dashboard, add these environment variables:

```bash
# Backend API URL (use your Render backend URL)
VITE_API_URL=https://your-backend-service.onrender.com/api

# Stripe (if using payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Step 4: Update CORS

After frontend deployment, update your backend's `CORS_ORIGINS` environment variable on Render to include your Vercel domain:

```bash
CORS_ORIGINS=https://your-app-name.vercel.app
```

## Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (Free tier is fine for development)
3. Set up database user with read/write permissions
4. Configure network access (allow access from anywhere: 0.0.0.0/0 for Render)

### Step 2: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `libathon_production`

## Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create an account
3. Go to Dashboard
4. Copy your `Cloud Name`, `API Key`, and `API Secret`
5. Add these to your backend environment variables

## Post-Deployment Steps

### 1. Test the Deployment

1. Visit your Vercel frontend URL
2. Test basic functionality:
   - User registration/login
   - Book browsing
   - Search functionality
   - Dashboard access

### 2. Seed Database (First Time Only)

Your database should be automatically seeded on first deployment if `SEED_DATABASE=true`. Monitor the Render logs to ensure seeding completes successfully.

### 3. Monitor Logs

- **Render**: Check logs in the Render dashboard
- **Vercel**: Check function logs in Vercel dashboard

### 4. Set Up Domain (Optional)

1. **Vercel**: Add custom domain in project settings
2. **Render**: Add custom domain in service settings

## Environment Variables Summary

### Backend (Render)
```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
NODE_ENV=production
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGINS=https://your-app.vercel.app
SEED_DATABASE=false
STRIPE_SECRET_KEY=sk_...
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-backend.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: 
   - Ensure CORS_ORIGINS includes your Vercel domain
   - Check that both HTTP and HTTPS are handled

2. **Database Connection**:
   - Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
   - Check connection string format

3. **Environment Variables**:
   - Ensure all required variables are set
   - Check for typos in variable names

4. **Build Errors**:
   - Check build logs in respective platforms
   - Ensure all dependencies are in package.json

### Logs and Debugging

- **Render Logs**: Available in dashboard under "Logs" tab
- **Vercel Logs**: Available in dashboard under "Functions" → "View Logs"
- **Database**: Monitor connection in MongoDB Atlas

## Scaling Considerations

1. **Database**: Consider upgrading MongoDB Atlas plan for production
2. **Render**: Upgrade to paid plan for better performance and no sleep
3. **CDN**: Vercel automatically provides CDN for frontend
4. **Monitoring**: Set up monitoring and alerting for production

## Security Considerations

1. **Environment Variables**: Never commit .env files
2. **JWT Secret**: Use a strong, randomly generated secret
3. **Database**: Restrict IP access in production if possible
4. **HTTPS**: Both platforms provide HTTPS by default
5. **CORS**: Be specific with allowed origins in production 