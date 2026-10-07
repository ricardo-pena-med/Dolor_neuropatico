#!/bin/zsh
set -eu
cd "${0:A:h}"
if command -v node >/dev/null 2>&1; then
  APP_NODE="$(command -v node)"
else
  APP_NODE="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ ! -x "$APP_NODE" || ! -f node_modules/vite/bin/vite.js ]]; then
  print 'Falta Node o las dependencias locales. Revisa README.md.'
  exit 1
fi
exec "$APP_NODE" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort
