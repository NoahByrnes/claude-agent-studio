#!/bin/bash
set -e

echo "Building shared-types..."
cd ../packages/shared-types
npm install
npm run build

echo "Building frontend..."
cd ../../frontend
npm install
npm run build

echo "Vercel build complete!"
