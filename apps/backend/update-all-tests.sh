#!/bin/bash

echo "🔧 Updating all test files to use helpers..."

# Array of test files
TESTS=(
  "src/comments/comments.service.spec.ts"
  "src/app.controller.spec.ts"
  "src/users/users.controller.spec.ts"
  "src/users/users.service.spec.ts"
  "src/likes/likes.controller.spec.ts"
  "src/likes/likes.service.spec.ts"
  "src/groups/groups.service.spec.ts"
  "src/messages/messages.service.spec.ts"
  "src/auth/auth.controller.spec.ts"
  "src/posts/posts.service.spec.ts"
  "src/posts/posts.controller.spec.ts"
)

for file in "${TESTS[@]}"; do
  echo "Processing: $file"
  
  # Skip if already has helper import
  if grep -q "test/helpers/test.module" "$file"; then
    echo "  ✅ Already updated"
    continue
  fi
  
  # Calculate correct relative path based on depth
  depth=$(echo "$file" | tr -cd '/' | wc -c)
  if [ $depth -eq 2 ]; then
    # src/xxx/xxx.spec.ts -> ../../test/helpers
    IMPORT_PATH="../../test/helpers/test.module"
  else
    # src/xxx.spec.ts -> ../test/helpers
    IMPORT_PATH="../test/helpers/test.module"
  fi
  
  # Add import after @nestjs/testing
  if grep -q "from '@nestjs/testing'" "$file"; then
    # Create backup
    cp "$file" "${file}.bak"
    
    # Add import line after @nestjs/testing import
    awk -v path="$IMPORT_PATH" '
      /@nestjs\/testing/ { 
        print; 
        if (!done) {
          print "import { getTestModuleMetadata, createMockPrismaService, MockEventsGateway } from '\''path'\'';";
          done=1
        }
        next
      }
      { print }
    ' "${file}.bak" | sed "s|'path'|'$IMPORT_PATH'|g" > "$file"
    
    rm "${file}.bak"
    echo "  ✅ Added helper imports"
  fi
done

echo ""
echo "✅ All tests updated!"
echo "Run: npm test"
