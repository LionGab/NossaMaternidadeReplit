#!/usr/bin/env bash
# organize-git.sh - Prepara repo para commit/build TestFlight
# Uso: bash scripts/organize-git.sh
set -euo pipefail

echo "🧹 Step 1/4: Cleanup..."
if [ -d "NossaMaternidade/" ]; then
  rm -rf NossaMaternidade/
  echo "✅ Removed duplicated folder NossaMaternidade/"
else
  echo "ℹ️ No duplicated folder found."
fi

echo ""
echo "📦 Step 2/4: Staging files..."

# Sempre garantir .gitignore no stage (evita a pasta voltar)
git add .gitignore 2>/dev/null || true

# Privacy Manifest (iOS) - crítico para iOS 17+
if [ -f "ios/PrivacyInfo.xcprivacy" ]; then
  git add ios/PrivacyInfo.xcprivacy
  echo "✅ Staged ios/PrivacyInfo.xcprivacy"
else
  echo "⚠️ ios/PrivacyInfo.xcprivacy not found (EAS will generate via app.config.js)"
fi

# Core config files
git add app.config.* 2>/dev/null || true
git add eas.json 2>/dev/null || true
git add package.json package-lock.json 2>/dev/null || true
git add tsconfig.json 2>/dev/null || true

# Source code
git add src/state 2>/dev/null || true
git add src/components 2>/dev/null || true
git add src/screens 2>/dev/null || true
git add src/navigation 2>/dev/null || true
git add src/hooks 2>/dev/null || true
git add src/api 2>/dev/null || true
git add src/theme 2>/dev/null || true
git add src/types 2>/dev/null || true
git add src/utils 2>/dev/null || true
git add src/services 2>/dev/null || true
git add src/config 2>/dev/null || true
git add src/context 2>/dev/null || true
git add src/ai 2>/dev/null || true

# Documentation
git add docs 2>/dev/null || true
git add PROJECT_RULES.md 2>/dev/null || true
git add CLAUDE.md 2>/dev/null || true
git add QUICKSTART.md 2>/dev/null || true

# Scripts
git add scripts 2>/dev/null || true

echo "✅ Files staged"

echo ""
echo "🔍 Step 3/4: Running quality gate..."
npm run quality-gate

echo ""
echo "📊 Step 4/4: Review changes"
echo "--- Staged files ---"
git status --short
echo ""
echo "--- Stats ---"
git diff --cached --stat 2>/dev/null || echo "No cached changes"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Ready for commit. Next steps:"
echo ""
echo "  1) Review: git diff --cached"
echo "  2) Commit: git commit -m 'chore(build): prepare for TestFlight vX.X.X'"
echo "  3) Diagnose: npm run diagnose:production"
echo "  4) Tag: git tag -a vX.X.X -m 'Release vX.X.X'"
echo "  5) Push: git push origin main --tags"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
