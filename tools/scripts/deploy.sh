#!/bin/bash

# ToolNest Production Deployment Script
# Usage: bash scripts/deploy.sh

set -e

echo "🚀 ToolNest Production Deployment"
echo "===================================="

# Step 1: Verify environment
echo "📋 Step 1: Verifying environment..."
bash scripts/verify-env.sh || exit 1

# Step 2: Install dependencies
echo ""
echo "📦 Step 2: Installing dependencies..."
npm install --production

# Step 3: Build verification
echo ""
echo "🔨 Step 3: Running build checks..."
npm run check

# Step 4: Deploy to Vercel
echo ""
echo "☁️  Step 4: Deploying to Vercel..."
vercel --prod --token=$VERCEL_TOKEN

# Step 5: Verify deployment
echo ""
echo "✅ Step 5: Verifying deployment..."
sleep 5

HEALTH_CHECK=$(curl -s https://toolnest.vercel.app/api/health)
if echo $HEALTH_CHECK | grep -q "healthy"; then
  echo -e "\n✅ Deployment successful!"
  echo "📍 Live at: https://toolnest.vercel.app"
else
  echo -e "\n⚠️  Health check failed. Check logs."
  exit 1
fi
