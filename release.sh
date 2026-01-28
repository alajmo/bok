#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: ./release.sh <version>"
  echo "Example: ./release.sh 0.1.4"
  exit 1
fi

VERSION="$1"
TAG="v$VERSION"

# Update version in package.json
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json

# Update version in mod.ts
sed -i "s/\.version(\"[^\"]*\")/.version(\"$VERSION\")/" mod.ts

# Commit version bump
git add package.json mod.ts
git commit -m "Bump version to $VERSION"

# Create and push tag
git tag "$TAG"
git push origin main "$TAG"

echo "Released $TAG"
