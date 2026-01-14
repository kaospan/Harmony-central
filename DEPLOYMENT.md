# Deployment Guide

## Overview

This guide covers deploying the Harmony Central backend API to various platforms. The mobile app deployment is platform-specific and should follow standard iOS/Android deployment procedures.

## Prerequisites

- Git repository access
- Node.js 18+ installed
- Production environment variables configured

## Backend Deployment Options

### Option 1: Heroku

**Advantages:** Simple, managed platform, free tier available

#### Steps

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create harmony-central-api
   ```

3. **Add Procfile** (create in project root)
   ```
   web: cd packages/backend && node dist/index.js
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=80
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Option 2: Railway

**Advantages:** Modern, automatic deployments, free tier

#### Steps

1. **Connect Repository**
   - Go to [Railway.app](https://railway.app/)
   - Connect your GitHub repository
   - Select the `Harmony-central` repository

2. **Configure Service**
   - Set root directory to `packages/backend`
   - Add build command: `npm install && npm run build`
   - Add start command: `node dist/index.js`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **Deploy**
   - Push to main branch
   - Railway auto-deploys

### Option 3: DigitalOcean App Platform

**Advantages:** Scalable, managed Kubernetes, good performance

#### Steps

1. **Create App**
   - Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect GitHub repository

2. **Configure Build**
   ```yaml
   name: harmony-central-api
   services:
   - name: backend
     build_command: npm install && npm run build -w @harmony-central/backend
     run_command: cd packages/backend && node dist/index.js
     environment_slug: node-js
     http_port: 3000
   ```

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"

### Option 4: AWS Elastic Beanstalk

**Advantages:** AWS ecosystem, highly scalable, advanced features

#### Steps

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   eb init -p node.js-18 harmony-central-api
   ```

3. **Create Environment**
   ```bash
   eb create harmony-central-prod
   ```

4. **Configure**
   Create `.ebextensions/nodecommand.config`:
   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "cd packages/backend && node dist/index.js"
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Option 5: Self-Hosted (VPS)

**Advantages:** Full control, cost-effective for scale

#### Steps

1. **Setup Server** (Ubuntu 22.04 example)
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install nginx
   sudo apt install -y nginx
   
   # Install PM2
   sudo npm install -g pm2
   ```

3. **Clone and Build**
   ```bash
   git clone https://github.com/kaospan/Harmony-central.git
   cd Harmony-central
   npm install
   npm run build
   ```

4. **Create PM2 Ecosystem File**
   Create `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'harmony-central-api',
       cwd: './packages/backend',
       script: './dist/index.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

5. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx**
   Create `/etc/nginx/sites-available/harmony-central`:
   ```nginx
   server {
     listen 80;
     server_name api.harmonycentral.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     }
   }
   ```

7. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/harmony-central /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.harmonycentral.com
   ```

## Environment Variables

### Required

```bash
NODE_ENV=production
PORT=3000
```

### Optional (for production features)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/harmony_central

# Redis Cache
REDIS_URL=redis://host:6379

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=https://app.harmonycentral.com,https://harmonycentral.com

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

## Database Setup (Production)

For production, replace in-memory storage with a database:

### PostgreSQL Setup

1. **Create Database**
   ```sql
   CREATE DATABASE harmony_central;
   CREATE USER harmony_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE harmony_central TO harmony_user;
   ```

2. **Update Code** (packages/backend/src/services/songRepository.ts)
   ```typescript
   import { Pool } from 'pg';
   
   export class SongRepository {
     private pool: Pool;
     
     constructor() {
       this.pool = new Pool({
         connectionString: process.env.DATABASE_URL
       });
     }
     
     async getAllSongs(): Promise<Song[]> {
       const result = await this.pool.query('SELECT * FROM songs');
       return result.rows;
     }
     
     // ... other methods
   }
   ```

3. **Install Dependencies**
   ```bash
   npm install pg --workspace=@harmony-central/backend
   npm install -D @types/pg --workspace=@harmony-central/backend
   ```

## Monitoring & Logging

### Application Monitoring

**Option 1: PM2 Plus** (for self-hosted)
```bash
pm2 install pm2-logrotate
pm2 link <secret> <public>
```

**Option 2: New Relic**
```bash
npm install newrelic --workspace=@harmony-central/backend
```

Create `newrelic.js` in backend root.

**Option 3: Datadog**
```bash
npm install dd-trace --workspace=@harmony-central/backend
```

### Log Aggregation

**Option 1: Winston + LogDNA/Papertrail**
```typescript
import winston from 'winston';
import LogdnaWinston from 'logdna-winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new LogdnaWinston({
      key: process.env.LOGDNA_KEY,
      app: 'harmony-central-api'
    })
  ]
});
```

**Option 2: Pino + Logtail**
```typescript
import pino from 'pino';

const logger = pino({
  transport: {
    target: '@logtail/pino',
    options: {
      sourceToken: process.env.LOGTAIL_TOKEN
    }
  }
});
```

## Health Checks

Ensure your platform monitors the health endpoint:

```bash
GET /health

Response: {"status":"ok","timestamp":"..."}
```

Configure health check intervals:
- Interval: 30 seconds
- Timeout: 5 seconds
- Unhealthy threshold: 3 failures

## Scaling Considerations

### Horizontal Scaling

1. **Enable Cluster Mode**
   ```javascript
   // In ecosystem.config.js
   instances: 'max',
   exec_mode: 'cluster'
   ```

2. **Add Load Balancer**
   - AWS: Application Load Balancer
   - DigitalOcean: Load Balancer
   - Self-hosted: Nginx upstream

3. **Session Management**
   - Use Redis for session storage
   - Enable sticky sessions on load balancer

### Vertical Scaling

Adjust instance size based on:
- Memory: 512MB minimum, 1GB recommended
- CPU: 1 core minimum, 2+ for production
- Monitor with: `pm2 monit` or platform metrics

## Backup & Disaster Recovery

### Database Backups

**Automated (PostgreSQL)**
```bash
# Daily backup cron job
0 2 * * * pg_dump -U harmony_user harmony_central > /backups/harmony-$(date +\%Y\%m\%d).sql
```

**AWS RDS**: Enable automated backups (7-35 days retention)

### Code Backups

- GitHub: Primary source of truth
- Docker images: Tagged releases
- Environment configs: Encrypted storage

## Security Checklist

- [ ] Use HTTPS (TLS/SSL certificates)
- [ ] Set secure headers (helmet.js)
- [ ] Enable CORS with whitelist
- [ ] Implement authentication (JWT/OAuth)
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database connection pooling
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection

## Rollback Procedure

### Heroku/Railway
```bash
heroku rollback
# or
railway rollback
```

### Self-Hosted
```bash
pm2 stop harmony-central-api
git checkout previous-commit
npm install
npm run build
pm2 restart harmony-central-api
```

## Performance Optimization

1. **Enable Caching**
   - Redis for API responses
   - CDN for static assets

2. **Database Optimization**
   - Index frequently queried fields
   - Connection pooling
   - Query optimization

3. **Compression**
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

4. **Response Times**
   - Target: < 200ms for simple queries
   - Target: < 500ms for comparisons

## Cost Estimation

### Heroku
- **Free tier**: 1 dyno (sleeps after 30 min)
- **Hobby**: $7/month (24/7 uptime)
- **Production**: $25-50/month (scale as needed)

### Railway
- **Free tier**: $5 credit/month
- **Paid**: ~$10-20/month for typical usage

### DigitalOcean
- **Basic**: $5/month (1GB RAM)
- **Professional**: $12/month (2GB RAM)

### AWS
- **Free tier**: 750 hours/month (first year)
- **t3.micro**: ~$8/month
- **t3.small**: ~$17/month

### Self-Hosted VPS
- **Basic**: $5-10/month (1-2GB RAM)
- **Production**: $20-40/month (4-8GB RAM)

## Support & Maintenance

- Monitor error logs daily
- Review performance metrics weekly
- Update dependencies monthly
- Security patches: immediate
- Feature releases: quarterly
- Database maintenance: monthly

## Troubleshooting

### High Memory Usage
```bash
# Check memory
pm2 status
# Restart if needed
pm2 restart harmony-central-api
```

### Slow Responses
- Check database query times
- Enable slow query log
- Review rate limit settings
- Check external API latencies

### Connection Errors
- Verify database connectivity
- Check firewall rules
- Review CORS settings
- Validate SSL certificates

## Additional Resources

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Configuration](https://www.nginx.com/resources/wiki/)
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization)
