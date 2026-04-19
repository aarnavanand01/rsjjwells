# Deployment & Production Notes

## Pre-Deployment Checklist

### Database
- [ ] Supabase project created and configured
- [ ] Database schema created (run SQL from SETUP_GUIDE.md)
- [ ] RLS policies enabled
- [ ] Indexes created for performance
- [ ] Database backups configured
- [ ] Test accounts created for QA

### Environment Variables
- [ ] `.env.local` created with Supabase credentials
- [ ] Environment variables added to Vercel project settings
- [ ] Variables verified in production dashboard
- [ ] No hardcoded secrets in code

### Security
- [ ] HTTPS enabled (Vercel handles this)
- [ ] CORS properly configured
- [ ] Rate limiting considered for API routes
- [ ] Input validation in place (Zod)
- [ ] Error messages don't leak sensitive data
- [ ] Admin routes properly protected

### Testing
- [ ] User signup and login tested
- [ ] Profile creation verified
- [ ] Admin dashboard access verified
- [ ] Protected routes redirect properly
- [ ] Logout functionality tested
- [ ] Mobile navigation tested
- [ ] Error states tested

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Complete full-stack authentication and admin dashboard"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

### 3. Post-Deployment Verification
1. Visit your production URL
2. Test signup/login flow
3. Check admin panel works
4. Verify database updates
5. Test email confirmation (if enabled)
6. Monitor error logs

## Important Configuration

### Supabase Settings

**Auth Configuration**:
- Email confirmation: Enable for production
- Password requirements: Set strong requirements
- Auth providers: Configure if using OAuth
- JWT expiration: Set to 7 days or as needed

**Database Configuration**:
- Backups: Daily at minimum
- Point-in-time recovery: Enable
- Connection pooling: Configure for better performance

**Storage Configuration** (if using file uploads):
- Configure CORS for your domain
- Set file size limits
- Enable secure token verification

### Next.js Configuration

Current `next.config.js` should work, but verify:
- Turbopack enabled (default in Next.js 13+)
- Image optimization working
- API routes accessible

## Environment Variable Details

### Required
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxx
```

### Optional (for future features)
```
# Payment processing
STRIPE_SECRET_KEY=sk_xxx
STRIPE_PUBLIC_KEY=pk_xxx

# Email notifications
SENDGRID_API_KEY=SG.xxx

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=xxx
```

## Performance Optimization

### Database
- Indexes created on `email` and `role` columns
- Queries optimized to fetch only needed fields
- Connection pooling enabled

### Frontend
- Auth state cached in context (no unnecessary API calls)
- Image optimization via Next.js Image component
- Code splitting for admin routes

### API Routes
- Middleware validates auth before database calls
- Response caching where appropriate
- Error handling prevents server crashes

## Monitoring & Logging

### What to Monitor
1. **Auth Failures**: Track login/signup errors
2. **API Performance**: Monitor API response times
3. **Database**: Watch query performance
4. **Errors**: Set up error tracking (Sentry recommended)
5. **Users**: Track admin actions

### Logging
Add logging to track:
```typescript
// In API routes
console.log('[v0]', 'User login attempt:', email);
console.log('[v0]', 'Admin action:', action, 'by:', adminId);
```

### Error Tracking (Recommended: Sentry)
```bash
npm install @sentry/nextjs
```

Then integrate in `next.config.js` and `pages/_app.tsx`.

## Common Production Issues

### Issue 1: "Secure cookie warning"
**Cause**: Using HTTP in development
**Solution**: Use HTTPS in production (Vercel handles this)

### Issue 2: Database connection timeouts
**Cause**: High traffic or connection pooling issues
**Solution**: 
- Enable connection pooling in Supabase
- Optimize queries
- Consider caching

### Issue 3: Auth token expired during user session
**Cause**: Token expiration configured too short
**Solution**: 
- Increase JWT expiration time in Supabase
- Implement refresh token logic

### Issue 4: Users can't upload files in admin
**Cause**: Storage bucket permissions
**Solution**: 
- Create storage bucket in Supabase
- Configure RLS policies for uploads
- Set CORS headers

## Database Backup Strategy

### Automated Backups (Supabase)
- Daily backups included in Pro plan
- Point-in-time recovery available
- Automatic retention for 30 days

### Manual Backup
```bash
# Export database
pg_dump postgres://user:password@host/dbname > backup.sql

# Import backup
psql postgres://user:password@host/dbname < backup.sql
```

## Scaling Considerations

### For 100+ Users
- Enable connection pooling (Supabase Pro)
- Optimize frequently-used queries
- Consider caching layer (Redis)

### For 1000+ Users
- Implement pagination in list views
- Add database read replicas if needed
- Use CDN for static assets
- Implement rate limiting

### For 10000+ Users
- Consider database sharding
- Implement comprehensive caching
- Use API rate limiting
- Set up load balancing

## Security Hardening

### API Route Protection
All API routes already have:
- Authentication checks
- Role-based authorization
- Input validation with Zod
- CORS headers

### Database Protection
- RLS (Row Level Security) policies enabled
- Minimum required data exposure
- Audit logs for sensitive operations

### Additional Recommendations
1. **Rate Limiting**:
```typescript
// In API routes
const RATE_LIMIT = 10; // requests per minute
```

2. **Helmet for Security Headers**:
```bash
npm install helmet
```

3. **CSRF Protection** (if forms added):
```bash
npm install csrf
```

## Testing in Production

### Test Accounts
Create test accounts for:
1. Regular user testing
2. Admin functionality testing
3. Edge case testing

### Smoke Tests
```bash
# Test signup
curl -X POST https://your-domain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test"}'

# Test login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test admin endpoint
curl https://your-domain.com/api/users
```

## Rollback Plan

### If Something Goes Wrong
1. **Check Vercel Deployments**: Can roll back to previous version
2. **Database**: Restore from backup in Supabase
3. **Manual Recovery**:
   - Identify issue
   - Fix code locally
   - Create patch
   - Deploy hotfix

## Monitoring Commands

### Check Vercel Deployment Status
```bash
vercel status
```

### Monitor Database
- Log into Supabase dashboard
- Check "Reports" section
- Monitor query performance

### Check Logs
```bash
# View Vercel logs
vercel logs

# Or in Vercel dashboard: Deployments → Function Logs
```

## Maintenance Tasks

### Weekly
- Review error logs
- Check database performance
- Monitor user feedback

### Monthly
- Review user statistics
- Optimize slow queries
- Update dependencies (carefully)

### Quarterly
- Security audit
- Performance review
- Capacity planning

## Disaster Recovery

### Database Recovery
1. Go to Supabase dashboard
2. Click "Backups" tab
3. Select backup from date
4. Click "Restore"

### Code Recovery
- Vercel keeps deployment history
- GitHub has full commit history
- Can revert to any previous commit

## Support & Resources

### Getting Help
1. Check error logs
2. Review documentation files
3. Check Supabase status page
4. Search GitHub issues
5. Ask in Supabase community

### Documentation
- SETUP_GUIDE.md - Complete setup
- IMPLEMENTATION_SUMMARY.md - What was built
- QUICKSTART.md - Quick reference

## Final Checklist Before Going Live

- [ ] All environment variables set
- [ ] Database schema created and verified
- [ ] User signup/login tested end-to-end
- [ ] Admin functionality tested
- [ ] Mobile responsiveness verified
- [ ] Error messages user-friendly
- [ ] Performance acceptable (< 2s page load)
- [ ] Security audit completed
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Support process documented
- [ ] Team trained on admin features

## Post-Launch Monitoring

**First Week**: Monitor intensively
- Check error logs hourly
- Monitor user signups
- Verify database performance
- Handle user support issues

**After Week 1**: Settle into routine
- Daily log review
- Weekly performance check
- Monthly security review

---

**Ready for production!** Follow this guide for a smooth deployment.
