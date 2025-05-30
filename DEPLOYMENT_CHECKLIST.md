# Deployment Checklist

Use this checklist to ensure successful deployment of your VIT Chennai Library Management System.

## Pre-Deployment Setup

### MongoDB Atlas
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster
- [ ] Create database user with read/write permissions
- [ ] Configure network access (0.0.0.0/0 for Render)
- [ ] Get connection string
- [ ] Test connection

### Cloudinary
- [ ] Create Cloudinary account
- [ ] Note down Cloud Name, API Key, and API Secret
- [ ] Test upload functionality

### Repository
- [ ] Push code to GitHub/GitLab
- [ ] Ensure all sensitive data is in environment variables
- [ ] Verify both `client` and `server` directories are present

## Backend Deployment (Render)

### Setup
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - [ ] Root Directory: `server`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`

### Environment Variables
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong random secret (32+ characters)
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- [ ] `CLOUDINARY_API_KEY` - From Cloudinary dashboard
- [ ] `CLOUDINARY_API_SECRET` - From Cloudinary dashboard
- [ ] `SEED_DATABASE=true` (for first deployment)
- [ ] `CORS_ORIGINS` - Will update after frontend deployment
- [ ] `STRIPE_SECRET_KEY` - If using payments

### Deployment
- [ ] Deploy service
- [ ] Wait for successful deployment
- [ ] Check logs for errors
- [ ] Test health endpoint: `https://your-service.onrender.com/health`
- [ ] Verify database seeding completed
- [ ] Set `SEED_DATABASE=false` after first successful deployment

## Frontend Deployment (Vercel)

### Setup
- [ ] Create Vercel account
- [ ] Create new project
- [ ] Import GitHub repository
- [ ] Configure build settings:
  - [ ] Framework: Vite
  - [ ] Root Directory: `client`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`

### Environment Variables
- [ ] `VITE_API_URL` - Your Render backend URL + `/api`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - If using payments

### Deployment
- [ ] Deploy project
- [ ] Wait for successful deployment
- [ ] Test frontend loads correctly
- [ ] Note down Vercel domain

## Post-Deployment Configuration

### Update Backend CORS
- [ ] Go to Render dashboard
- [ ] Update `CORS_ORIGINS` environment variable with Vercel domain
- [ ] Redeploy backend service

### Testing
- [ ] Test frontend loads at Vercel URL
- [ ] Test user registration/login
- [ ] Test book browsing and search
- [ ] Test dashboard functionality
- [ ] Test image uploads (book covers, etc.)
- [ ] Test all major features
- [ ] Check browser console for errors
- [ ] Test on mobile devices

### Monitoring
- [ ] Check Render logs for backend errors
- [ ] Check Vercel logs for frontend errors
- [ ] Monitor MongoDB Atlas metrics
- [ ] Set up error tracking (optional)

## Domain Setup (Optional)
- [ ] Configure custom domain on Vercel
- [ ] Update DNS settings
- [ ] Update CORS_ORIGINS with new domain
- [ ] Test with custom domain

## Security Checklist
- [ ] All environment variables are set
- [ ] No sensitive data in code repository
- [ ] JWT secret is strong and unique
- [ ] Database has proper access controls
- [ ] CORS is configured correctly
- [ ] HTTPS is enabled (automatic on both platforms)

## Performance Optimization
- [ ] Consider upgrading Render plan (removes sleep)
- [ ] Consider upgrading MongoDB Atlas plan
- [ ] Enable compression in backend (if not already)
- [ ] Optimize image sizes
- [ ] Review and optimize API endpoints

## Backup and Recovery
- [ ] Set up MongoDB Atlas automated backups
- [ ] Document recovery procedures
- [ ] Test backup restoration process

## Troubleshooting Reference

### Common Issues
1. **Build Failures**
   - Check package.json dependencies
   - Verify build commands
   - Check platform-specific logs

2. **CORS Errors**
   - Verify CORS_ORIGINS includes your domain
   - Check for http vs https mismatches

3. **Database Connection Issues**
   - Verify MongoDB Atlas network access
   - Check connection string format
   - Ensure database user has proper permissions

4. **Environment Variable Issues**
   - Check for typos in variable names
   - Ensure all required variables are set
   - Verify variable values are correct

### Support Resources
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## Success Criteria
- [ ] Frontend loads without errors
- [ ] Users can register and login
- [ ] Books can be browsed and searched
- [ ] Dashboard displays user data
- [ ] Image uploads work correctly
- [ ] All major features function properly
- [ ] No console errors
- [ ] Responsive on mobile devices

**Deployment Complete!** 🎉

Remember to:
- Keep environment variables secure
- Monitor application performance
- Regularly update dependencies
- Keep backups current 