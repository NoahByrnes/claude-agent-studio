#!/bin/bash
set -e

echo "Building shared types..."
cd packages/shared-types
npm install
npm run build

echo "Building agent runtime..."
cd ../../agent-runtime
npm install
npm run build

echo "Worker build complete!"
