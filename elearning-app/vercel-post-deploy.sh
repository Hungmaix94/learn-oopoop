#!/bin/bash
# Vercel Post-Deploy Hook - runs after deployment completes
# This script seeds the database with course data

echo "🌱 Running post-deploy seed..."
node seed.mjs
echo "✅ Post-deploy seed complete"
