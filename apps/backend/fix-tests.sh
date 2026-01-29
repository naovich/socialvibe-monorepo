#!/bin/bash

# Script to fix all test files to use test helpers

echo "🔧 Fixing test imports..."

# Find all spec files
SPEC_FILES=$(find src -name "*.spec.ts")

for file in $SPEC_FILES; do
  echo "Processing: $file"
  
  # Check if file already imports test helpers
  if grep -q "test/helpers/test.module" "$file"; then
    echo "  ✅ Already fixed"
    continue
  fi
  
  # Add import after existing Test import
  if grep -q "from '@nestjs/testing'" "$file"; then
    # Add helper import after @nestjs/testing import
    sed -i "/from '@nestjs\/testing'/a import { getTestModuleMetadata, createMockPrismaService, MockEventsGateway } from '../../test/helpers/test.module';" "$file" 2>/dev/null || \
    sed -i "/from '@nestjs\/testing'/a import { getTestModuleMetadata, createMockPrismaService, MockEventsGateway } from '../../../test/helpers/test.module';" "$file"
    
    echo "  ✅ Added helper imports"
  fi
done

echo "✅ All tests updated!"
echo ""
echo "Run: npm test"
