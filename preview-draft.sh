#!/usr/bin/env bash
# Render copy-draft.md to a formatted HTML page and open it in the default browser.
# Then: Cmd+A, Cmd+C in the browser → paste into the Google Doc (rich text preserved).
set -euo pipefail

cd "$(dirname "$0")"

out="/private/tmp/copy-draft.html"

pandoc copy-draft.md -f markdown -t html -s \
  --metadata title="Jurl30fruit copy draft" \
  -o "$out"

open "$out"
echo "Rendered and opened: $out"
