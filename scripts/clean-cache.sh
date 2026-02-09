#!/usr/bin/env bash
# clean-cache.sh - Limpa caches do Metro, Expo e watchman
# Uso: npm run clean ou bash scripts/clean-cache.sh
set -e

echo "🧹 Cleaning caches..."

# Metro bundler cache
echo "  → Metro cache..."
rm -rf .metro 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf /tmp/metro-* 2>/dev/null || true

# Expo cache
echo "  → Expo cache..."
rm -rf .expo 2>/dev/null || true
rm -rf ~/.expo/web-build 2>/dev/null || true

# React Native cache
echo "  → React Native cache..."
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true
rm -rf $TMPDIR/haste-map-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

# Watchman (se disponível)
if command -v watchman &> /dev/null; then
  echo "  → Watchman..."
  watchman watch-del-all 2>/dev/null || true
fi

# iOS (se existir pasta ios/)
if [ -d "ios" ]; then
  echo "  → iOS build cache..."
  rm -rf ios/build 2>/dev/null || true
  rm -rf ios/Pods 2>/dev/null || true
  rm -rf ios/Podfile.lock 2>/dev/null || true
fi

# Android (se existir pasta android/)
if [ -d "android" ]; then
  echo "  → Android build cache..."
  rm -rf android/.gradle 2>/dev/null || true
  rm -rf android/build 2>/dev/null || true
  rm -rf android/app/build 2>/dev/null || true
fi

echo "✅ Caches cleaned!"
