# 📋 Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Backend API tested with Postman/Thunder Client
- [ ] Database migrations working correctly
- [ ] All environment variables documented

### Git & GitHub
- [ ] Git initialized in project
- [ ] All files committed
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] `.env` files NOT committed (check .gitignore)

### Configuration Files
- [ ] `backend/package.json` has `start` script
- [ ] `.env.production` created for frontend
- [ ] `vercel.json` or `render.yaml` configured
- [ ] CORS settings updated in backend

## Deployment Checklist

### Database (Railway/Aiven)
- [ ] MySQL database provisioned
- [ ] Database credentials saved securely
- [ ] Database accessible from external connections
- [ ] Connection tested

### Backend (Render/Railway)
- [ ] Service created and connected to GitHub
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] All environment variables added:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT` (if required)
  - [ ] `DB_HOST`
  - [ ] `DB_PORT`
  - [ ] `DB_USER`
  - [ ] `DB_PASSWORD`
  - [ ] `DB_NAME`
  - [ ] `JWT_SECRET`
  - [ ] `FRONTEND_URL`
- [ ] Backend deployed successfully
- [ ] Backend URL saved
- [ ] Health check endpoint working (`/health`)

### Frontend (Vercel/Render)
- [ ] Service created and connected to GitHub
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added:
  - [ ] `VITE_API_URL` (backend URL)
- [ ] Frontend deployed successfully
- [ ] Frontend URL saved

### Cross-Service Configuration
- [ ] Backend `FRONTEND_URL` updated with actual frontend URL
- [ ] Frontend `VITE_API_URL` points to actual backend URL
- [ ] CORS configured with correct frontend URL
- [ ] Both services redeployed after URL updates

## Post-Deployment Testing

### Basic Functionality
- [ ] Frontend loads without errors
- [ ] Backend API responds at `/health`
- [ ] Database connection successful

### User Flows - Admin
- [ ] Admin can register
- [ ] Admin can login
- [ ] Admin can view dashboard
- [ ] Admin can manage doctors
- [ ] Admin can manage patients
- [ ] Admin can view appointments
- [ ] Admin can logout

### User Flows - Doctor
- [ ] Doctor can login (use admin-created account)
- [ ] Doctor can view dashboard
- [ ] Doctor can view appointments
- [ ] Doctor can view patient details
- [ ] Doctor can prescribe medicine
- [ ] Doctor can order lab tests
- [ ] Doctor can logout

### User Flows - Patient
- [ ] Patient can register
- [ ] Patient can login
- [ ] Patient can view dashboard
- [ ] Patient can book appointment
- [ ] Patient can view appointments
- [ ] Patient can view prescriptions
- [ ] Patient can view lab tests
- [ ] Patient can view billing
- [ ] Patient can logout

### Data Persistence
- [ ] New registrations persist after page reload
- [ ] Appointments saved to database
- [ ] Prescriptions saved to database
- [ ] Lab tests saved to database
- [ ] User sessions maintained
- [ ] Logout clears session properly

### Error Handling
- [ ] Invalid login shows error message
- [ ] Network errors handled gracefully
- [ ] 404 pages work correctly
- [ ] Validation errors display properly
- [ ] Database errors don't crash the app

## Performance & Security

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] Images optimized
- [ ] No memory leaks in console

### Security
- [ ] Passwords hashed in database
- [ ] JWT tokens working correctly
- [ ] Protected routes require authentication
- [ ] CORS configured correctly
- [ ] No sensitive data in frontend code
- [ ] `.env` files not in repository
- [ ] HTTPS enabled (automatic on Vercel/Render)

## Optional Enhancements

### Custom Domain
- [ ] Domain purchased (optional)
- [ ] Domain connected to Vercel/Render
- [ ] DNS records configured
- [ ] SSL certificate active

### Monitoring
- [ ] Error tracking setup (Sentry, LogRocket)
- [ ] Analytics added (Google Analytics, Plausible)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)

### Backups
- [ ] Database backup strategy defined
- [ ] Automated backups enabled
- [ ] Backup restoration tested

## Troubleshooting Log

Use this section to track any issues encountered:

| Issue | Solution | Date |
|-------|----------|------|
|       |          |      |
|       |          |      |
|       |          |      |

## Deployment URLs

Record your deployment URLs here:

```
Frontend URL: https://_____________________.vercel.app
Backend URL:  https://_____________________.onrender.com
Database:     Railway MySQL / Aiven MySQL
```

## Credentials (KEEP SECURE!)

**DO NOT COMMIT THIS FILE WITH REAL CREDENTIALS**

```
Database Host: ___________________
Database Port: ___________________
Database User: ___________________
Database Password: ___________________
Database Name: ___________________

JWT Secret: ___________________

Admin Email: ___________________
Admin Password: ___________________
```

---

## 🎉 Deployment Complete!

Once all items are checked, your Smart Hospital System is live and ready to use!

**Share your app**: `https://your-app-name.vercel.app`

---

## Next Steps

1. Share the URL with stakeholders
2. Gather user feedback
3. Monitor error logs
4. Plan feature updates
5. Set up CI/CD for automatic deployments

**Need help?** Refer to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) or [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
