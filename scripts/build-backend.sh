#!/bin/bash
set -e

echo "Building shared types..."
cd packages/shared-types
npm install
npm run build

echo "Building backend..."
cd ../../backend
npm install
npm run build

echo "Backend build complete!"
