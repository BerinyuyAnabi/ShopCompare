#!/bin/bash

# Deployment script for ShopCompare
# Run this on the university server

echo "=== ShopCompare Deployment Script ==="
echo ""

# Navigate to frontend directory
cd ~/public_html/ShopCompare/frontend || exit 1

echo "1. Installing dependencies..."
npm install

echo ""
echo "2. Building production files..."
npm run build

echo ""
echo "3. Moving built files to frontend directory..."
# Backup existing files
if [ -f "index.html" ]; then
    echo "   Backing up existing files..."
    mkdir -p ../backup_$(date +%Y%m%d_%H%M%S)
    cp index.html ../backup_$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
fi

# Copy dist contents to frontend directory
echo "   Copying built files..."
cp -r dist/* .

echo ""
echo "4. Setting proper permissions..."
chmod -R 755 ~/public_html/ShopCompare

echo ""
echo "=== Deployment Complete! ==="
echo ""
echo "Test your application at:"
echo "http://169.239.251.102:3410/~logan.anabi/ShopCompare/frontend/"
echo ""
echo "Test backend at:"
echo "http://169.239.251.102:3410/~logan.anabi/ShopCompare/backend/api/test.php"
