#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: ./release.sh <version>"
  echo "Example: ./release.sh 0.1.4"
  exit 1
fi

VERSION="$1"
TAG="v$VERSION"
DATE=$(date +%Y-%m-%d)
REPO_URL="https://github.com/alajmo/bok"

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

# Get the previous tag
PREV_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

# Generate changelog entries from commits since last tag
echo "Generating changelog entries..."
if [[ -n "$PREV_TAG" ]]; then
  COMMITS=$(git log "$PREV_TAG"..HEAD --pretty=format:"- %s" --no-merges)
else
  COMMITS=$(git log --pretty=format:"- %s" --no-merges)
fi

# Create the new changelog section
NEW_SECTION="## [$VERSION] - $DATE

### Changed
$COMMITS"

# Update CHANGELOG.md
echo "Updating CHANGELOG.md..."

# Insert new section after "## [Unreleased]" line
awk -v section="$NEW_SECTION" '
/^## \[Unreleased\]/ {
  print
  print ""
  print section
  next
}
{print}
' CHANGELOG.md > CHANGELOG.tmp && mv CHANGELOG.tmp CHANGELOG.md

# Update the links at the bottom
# First, update the [Unreleased] link to compare from new version
sed -i "s|\[Unreleased\]: $REPO_URL/compare/v[^.]*\.[^.]*\.[^.]*\.\.\.HEAD|[Unreleased]: $REPO_URL/compare/$TAG...HEAD|" CHANGELOG.md

# Add the new version link before the previous version link
if [[ -n "$PREV_TAG" ]]; then
  sed -i "/^\[$PREV_TAG\]/i [$VERSION]: $REPO_URL/compare/$PREV_TAG...$TAG" CHANGELOG.md
else
  # If no previous tag, add link at the end
  echo "[$VERSION]: $REPO_URL/releases/tag/$TAG" >> CHANGELOG.md
fi

# Update version in package.json
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json

# Update version in mod.ts
sed -i "s/\.version(\"[^\"]*\")/.version(\"$VERSION\")/" mod.ts

# Extract release notes for this version (for GitHub release)
echo "Extracting release notes..."
awk -v ver="$VERSION" '
  /^## \[/ {
    if (found) exit
    if ($0 ~ "\\[" ver "\\]") found=1
    next
  }
  found {print}
' CHANGELOG.md > RELEASE_NOTES.md

# Commit version bump
git add package.json mod.ts CHANGELOG.md
git commit -m "Release $VERSION"

# Create and push tag
git tag -a "$TAG" -m "Release $VERSION"
git push origin main "$TAG"

echo ""
echo "Released $TAG"
echo ""
echo "Release notes saved to RELEASE_NOTES.md"
