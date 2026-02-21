# Deployment Guide

## Overview

This guide provides instructions for deploying the Slides App to production environments. It covers various deployment scenarios and best practices for maintaining a secure, performant application.

## Prerequisites

Before deploying, ensure you have:

- A server or cloud platform account (AWS, DigitalOcean, Vercel, etc.)
- Domain name configured
- SSL certificate (recommended)
- PostgreSQL database in production
- Environment variables prepared

## Environment Configuration

### Required Environment Variables

```bash
# Database configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# Payload secret (use a strong random value)
PAYLOAD_SECRET="your-production-secret-key-here"

# Node environment
NODE_ENV="production"

# Application URL (for redirects and email links)
NEXT_PUBLIC_SERVER_URL="https://yourdomain.com"

# Admin email (for initial admin user)
ADMIN_EMAIL="admin@yourdomain.com"

# Admin password (for initial admin user)
ADMIN_PASSWORD="secure-admin-password"

# SMTP configuration (for email notifications)
SMTP_HOST="smtp.provider.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@yourdomain.com"
```

### Recommended Environment Variables

```bash
# Redis for session storage (optional but recommended)
REDIS_URL="redis://host:port"

# CDN configuration (optional)
NEXT_PUBLIC_CDN_URL="https://cdn.yourdomain.com"

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"

# Logging level
LOG_LEVEL="info"
```

## Deployment Platforms

### Vercel (Recommended for Next.js)

1. Install the Vercel CLI:
```bash
npm i -g vercel
```

2. Link your project:
```bash
vercel link
```

3. Set environment variables in the Vercel dashboard or CLI:
```bash
vercel env add DATABASE_URL production
vercel env add PAYLOAD_SECRET production
# Add other required variables
```

4. Deploy:
```bash
vercel --prod
```

### AWS Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize your application:
```bash
eb init
```

3. Create a configuration file `.ebextensions/nodejs.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeVersion: 18.17.0
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

4. Deploy:
```bash
eb deploy
```

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t slides-app .
```

2. Run the container:
```bash
docker run -d \
  --name slides-app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e PAYLOAD_SECRET="..." \
  slides-app
```

### Manual Server Deployment

1. Build the application:
```bash
pnpm build
```

2. Set environment variables on your server

3. Start the application:
```bash
pnpm start
```

## Database Migration

### Production Migration

Before deploying new versions with schema changes:

1. Create migration files:
```bash
pnpm payload migrate:create
```

2. Apply migrations to production database:
```bash
NODE_ENV=production pnpm payload migrate
```

### Backup Strategy

Regularly backup your production database:

```bash
# PostgreSQL backup
pg_dump -h host -U username -d database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

Store backups securely with encryption and retention policies.

## Security Best Practices

### HTTPS Configuration

Always use HTTPS in production:

1. Obtain SSL certificate (Let's Encrypt, commercial CA, etc.)
2. Configure your reverse proxy (nginx, Apache) or cloud provider to enforce HTTPS
3. Set up automatic certificate renewal

### Environment Security

- Store secrets in environment variables, not in code
- Use different secrets for different environments
- Rotate secrets regularly
- Limit access to environment variables

### Database Security

- Use strong passwords for database access
- Restrict database access to specific IPs
- Enable SSL for database connections
- Regularly update database software

### Application Security

- Keep dependencies updated
- Monitor for security vulnerabilities
- Implement rate limiting
- Validate and sanitize all inputs
- Use Content Security Policy (CSP)

## Performance Optimization

### Caching Strategy

1. **HTTP Caching**: Configure proper cache headers for static assets
2. **CDN**: Use a CDN for serving static assets
3. **Database Caching**: Implement Redis for session and data caching
4. **Application Caching**: Use Next.js caching features

### Database Optimization

- Index frequently queried fields
- Optimize database queries
- Use connection pooling
- Monitor slow queries

### Asset Optimization

- Enable gzip compression
- Optimize images (WebP format where supported)
- Minimize and compress JavaScript/CSS
- Use lazy loading for non-critical resources

## Monitoring and Logging

### Application Monitoring

Set up monitoring for:

- Application performance (response times, throughput)
- Error rates
- Resource utilization (CPU, memory)
- Database performance
- User activity

### Logging Configuration

Configure logging levels:

```bash
# For production
LOG_LEVEL="warn"
# For debugging
LOG_LEVEL="debug"
```

Ensure logs are stored securely and rotated regularly.

### Health Checks

Implement health check endpoints:

```
GET /api/health
```

This should return status information about the application and its dependencies.

## Backup and Recovery

### Automated Backups

Set up automated backups for:

- Database (daily full, hourly incremental)
- File uploads (if stored separately)
- Configuration files
- Application code

### Disaster Recovery Plan

1. Document recovery procedures
2. Test recovery procedures regularly
3. Maintain off-site backup copies
4. Establish recovery time objectives (RTO) and recovery point objectives (RPO)

## Maintenance Procedures

### Regular Updates

- Update Node.js version periodically
- Update dependencies regularly
- Apply security patches promptly
- Update database software

### Content Management

- Regular content audits
- Cleanup unused media files
- Archive old content appropriately
- Monitor user-generated content

### Performance Tuning

- Monitor application performance
- Optimize slow queries
- Adjust caching strategies
- Scale resources as needed

## Rollback Procedures

### Version Control

Maintain clear version control:

1. Tag releases in Git
2. Use semantic versioning
3. Maintain changelog
4. Test rollback procedures

### Rollback Process

1. Identify the problematic release
2. Revert to the previous stable version
3. Apply database rollbacks if necessary
4. Monitor application after rollback
5. Investigate and fix the issue before redeploying

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify DATABASE_URL is correct
- Check firewall rules for database access
- Ensure database is running and accepting connections
- Verify database credentials

#### Build Failures
- Check available disk space
- Verify Node.js version compatibility
- Ensure all dependencies are installed
- Check for syntax errors in configuration files

#### Performance Issues
- Monitor resource utilization
- Check for slow database queries
- Verify caching configuration
- Review third-party service dependencies

### Diagnostic Commands

```bash
# Check application status
pm2 status

# View application logs
pm2 logs

# Check database connectivity
npx payload db:connect

# Run diagnostics
pnpm run dev  # For development diagnostics
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancers for multiple instances
- Implement session sharing (Redis)
- Ensure application statelessness
- Use distributed caching

### Vertical Scaling

- Monitor resource usage
- Upgrade server resources as needed
- Optimize application performance
- Consider database scaling options

## Checklist for Production Deployment

- [ ] Environment variables configured securely
- [ ] Database migrated to production schema
- [ ] SSL certificate installed and enforced
- [ ] Backup procedures in place
- [ ] Monitoring and alerting configured
- [ ] Security measures implemented
- [ ] Performance optimizations applied
- [ ] Rollback procedures documented
- [ ] Load testing completed
- [ ] Content audit performed
- [ ] Legal compliance verified (privacy policy, terms of service)