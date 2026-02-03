#!/bin/bash

# Files to fix
files=(
  "src/components/feed/PostModal.tsx"
  "src/components/feed/Stories.tsx"
  "src/components/feed/StoryBar.tsx"
  "src/components/layout/Sidebar.tsx"
  "src/features/feed/components/CreatePostModal.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Add null check after currentUser declaration
    sed -i '/const.*currentUser.*=.*useSocialStore/a\  if (!currentUser) return null;' "$file"
    echo "Fixed: $file"
  fi
done
