#!/usr/bin/env bash
set -e

# Installer script to download vendor files into public/vendor/
# Run this from the repository root or from public/ as: ./vendor/install-vendor.sh

mkdir -p "$(dirname "$0")"
cd "$(dirname "$0")"

echo "Downloading vendor files into $(pwd)..."

# Bootstrap CSS
curl -fsSL -o bootstrap.min.css "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"

# React UMD
curl -fsSL -o react.production.min.js "https://unpkg.com/react@18/umd/react.production.min.js"
curl -fsSL -o react-dom.production.min.js "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"

# Babel standalone (used only if you keep type="text/babel" in app.html)
curl -fsSL -o babel.min.js "https://unpkg.com/@babel/standalone/babel.min.js"

echo "Download complete. Files placed in $(pwd):"
ls -lh

echo "\nNow run a static server from the public/ folder and open app.html to test."