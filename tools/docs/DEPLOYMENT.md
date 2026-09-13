# ToolNest Deployment Guide

## Quick Start

### 1-Command Deployment
```bash
bash scripts/deploy.sh
```

This runs:
1. Environment verification
2. Dependency installation
3. Build checks
4. Vercel deployment
5. Health verification

## Manual Deployment Steps

### Step 1: Prepare Environment
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Step 2: Verify Setup
```bash
bash scripts/verify-env.sh
```

### Step 3: Deploy
```bash
vercel --prod
```

## Environment Variables Required

| Variable | Purpose | Required |
|----------|---------|----------|
| DATABASE_URL | PostgreSQL connection | Yes |
| REDIS_URL | Cache store | Yes |
| VERCEL_TOKEN | Vercel authentication | Yes |
| OPENAI_API_KEY | AI features | Yes |
| RAZORPAY_KEY_ID | Payment processing | Yes |
| AWS_ACCESS_KEY_ID | File storage | Yes |

## Vercel Configuration

**vercel.json** settings:
```json
{
  "functions": {
    "api/ai.js": { "maxDuration": 30 },
    "api/health.js": { "maxDuration": 10 }
  }
}
```

- AI endpoint: 30 second timeout
- Health check: 10 second timeout

## Post-Deployment

### Verify API Endpoints
```bash
# Health check
curl https://your-domain.com/api/health

# AI endpoint (test)
curl -X POST https://your-domain.com/api/ai \
  -H "Content-Type: application/json" \
  -d '{"action":"summarize","text":"Your text here"}'
```

### Monitor Logs
Vercel Dashboard → Project → Logs

### Setup Monitoring
- Error tracking: Sentry
- Uptime: Better Stack / StatusPage
- Performance: Vercel Analytics

## Rollback

If deployment fails:
```bash
vercel rollback
```

## Troubleshooting

### Functions Not Deploying
- Check `vercel.json` syntax
- Verify function exports are correct
- Check `api/` folder structure

### Environment Variables Not Working
- Set in Vercel Dashboard (Settings → Environment Variables)
- Rebuild/redeploy after adding variables
- Check variable names match exactly

### Database Connection Fails
- Verify DATABASE_URL format
- Check firewall rules allow Vercel IPs
- Test connection from local machine first

## Performance Optimization

1. **Database**: Enable connection pooling
2. **Cache**: Use Redis for session/API responses
3. **Images**: Optimize images before upload
4. **API**: Implement request caching

## Security

- Never commit `.env` files
- Rotate API keys monthly
- Use environment variables for all secrets
- Enable firewall rules on database
- Monitor API usage for abuse
