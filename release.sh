#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: ./release.sh <version>"
  echo "Example: ./release.sh 0.1.4"
  exit 1
fi

VERSION="$1"
TAG="v$VERSION"

# Ensure working tree is clean
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Error: Working tree is not clean. Commit or stash changes first."
  exit 1
fi

# Check if tag already exists
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Error: Tag $TAG already exists"
  exit 1
fi

# Update version in package.json
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json

# Update version in mod.ts
sed -i "s/\.version(\"[^\"]*\")/.version(\"$VERSION\")/" mod.ts

# Commit version bump if there are changes
if ! git diff --quiet package.json mod.ts; then
  git add package.json mod.ts
  git commit -m "Bump version to $VERSION"
fi

# Create and push tag
git tag "$TAG"
git push origin main "$TAG"

echo "Released $TAG"
