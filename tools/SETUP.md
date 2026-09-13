# ToolNest - Production Setup Guide

## Overview
ToolNest is a 5-phase SaaS platform with image/PDF tools, AI utilities, digital products, and data automation. This guide covers production setup.

## Prerequisites
- Node.js >= 20
- Git
- Vercel account
- PostgreSQL database
- Redis instance
- AWS S3 bucket (optional, for file storage)

## Phase 1: Local Development

### 1. Clone Repository
```bash
git clone https://github.com/bhomvratrai-glitch/Toolnest.git
cd Toolnest
```

### 2. Setup Environment Variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:

**Critical Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection URL
- `VERCEL_TOKEN` - Vercel authentication token
- `OPENAI_API_KEY` - AI provider key (for Phase 3)
- `RAZORPAY_KEY_ID` - Payment gateway (for Phase 4)
- `AWS_ACCESS_KEY_ID` - S3 storage credentials

### 3. Install Dependencies
```bash
npm install
```

### 4. Verify Setup
```bash
npm run check
```

## Phase 2: Database Setup

### PostgreSQL Configuration
```bash
# Create database
creatdb toolnest

# Initialize schema (create migrations/ folder with SQL files)
psql -d toolnest < migrations/init.sql
```

**Required Tables:**
- `users` - User accounts
- `products` - Digital products catalog
- `orders` - Purchase history
- `api_logs` - Request tracking
- `file_uploads` - User file metadata

### Redis Setup
```bash
# Start Redis locally
redis-server

# Or use managed Redis (AWS ElastiCache, Upstash, etc.)
REDIS_URL=redis://cache-provider-url:6379
```

## Phase 3: Vercel Deployment

### 1. Connect Repository
```bash
# Create Vercel project
vercel
```

### 2. Environment Variables in Vercel Dashboard
Add all `.env.example` variables in:
Project Settings → Environment Variables

**Priority:**
- `VERCEL_TOKEN` (for CI/CD)
- `DATABASE_URL` (database connection)
- `REDIS_URL` (caching)
- `OPENAI_API_KEY` (AI features)
- `RAZORPAY_KEY_ID` & `RAZORPAY_SECRET_KEY` (payments)
- `AWS_*` (file storage)

### 3. Deploy
```bash
vercel --prod
```

## Phase 4: API Endpoints Setup

### Serverless Functions (api/ folder)

**ai.js** - AI utilities endpoint
```
POST /api/ai
Body: { action: 'summarize|rewrite|title|translate', text: 'content' }
Response: { success: true, result: 'processed text' }
```

**health.js** - Health check
```
GET /api/health
Response: { status: 'healthy', timestamp, uptime, environment }
```

### Production Considerations
- Add rate limiting (use middleware)
- Implement request validation
- Add error logging (Sentry/LogRocket)
- Monitor API performance
- Setup automatic backups

## Phase 5: Third-party Services Integration

### AI Provider (OpenAI/Gemini)
```javascript
// api/ai.js should call provider API
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify({ model: 'gpt-4', messages: [...] })
});
```

### Payment Gateway (Razorpay)
```javascript
// Create order in Razorpay
const order = await razorpay.orders.create({
  amount: price * 100, // in paise
  currency: 'INR',
  receipt: orderId
});
```

### File Storage (AWS S3)
```javascript
// Upload to S3
const s3 = new AWS.S3();
await s3.putObject({
  Bucket: process.env.AWS_S3_BUCKET,
  Key: filePath,
  Body: fileContent
}).promise();
```

### Analytics
- Vercel Analytics (built-in)
- Google Analytics (add tracking ID)
- Custom dashboard (optional)

### AdSense
- Apply for approval at https://www.google.com/adsense/
- Add to index.html when approved:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"></script>
```

## Monitoring & Maintenance

### Health Checks
```bash
# Check API health
curl https://your-domain.com/api/health
```

### Logs
- Vercel Dashboard → Logs
- Database query logs
- Error tracking (Sentry)

### Backups
- PostgreSQL: Daily automated backups
- S3: Enable versioning
- Code: Git repository

## Security Checklist

- [ ] All secrets in environment variables (never in code)
- [ ] SSL/TLS enabled (automatic with Vercel)
- [ ] Database credentials secured
- [ ] API keys rotated regularly
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens enabled

## Troubleshooting

### 404 on /api/health
- Vercel serverless functions not deployed
- Check: Vercel Dashboard → Functions

### Database connection errors
- Verify DATABASE_URL format
- Check database firewall rules
- Test connection locally first

### Payment failures
- Verify Razorpay credentials
- Check account approval status
- Review transaction logs

### AI responses failing
- Verify OPENAI_API_KEY is valid
- Check API rate limits
- Review error logs in Vercel

## Support
- Documentation: See README.md
- Issues: GitHub Issues
- Contact: support@example.com
