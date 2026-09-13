#!/bin/bash

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 ToolNest Environment Verification"
echo "====================================="

# Required variables
REQUIRED_VARS=(
  "DATABASE_URL"
  "REDIS_URL"
  "VERCEL_TOKEN"
  "OPENAI_API_KEY"
  "RAZORPAY_KEY_ID"
  "AWS_ACCESS_KEY_ID"
)

ERRORS=0
WARNINGS=0

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}✗ MISSING: $var${NC}"
    ((ERRORS++))
  else
    echo -e "${GREEN}✓ SET: $var${NC}"
  fi
done

echo ""
echo "📊 Summary:"
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"

if [ $ERRORS -gt 0 ]; then
  echo -e "\n${RED}❌ Setup incomplete. Fix missing variables in .env${NC}"
  exit 1
else
  echo -e "\n${GREEN}✅ Environment ready for production${NC}"
  exit 0
fi
