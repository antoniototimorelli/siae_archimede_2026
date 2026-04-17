#!/usr/bin/env bash
# tests/test.sh
# Dispatcher globale: esegue tutti i file *.test.sh nella stessa cartella
# e aggrega il risultato. Exit 0 se tutti i file passano, 1 altrimenti.

set -uo pipefail

TESTS_DIR="$(cd "$(dirname "$0")" && pwd)"
TOTAL=0
FAILED=0

echo "=== SIAE-PLUGIN · test suite ==="
echo ""

shopt -s nullglob
for test_file in "$TESTS_DIR"/*.test.sh; do
  ((TOTAL++))
  echo "▶ $(basename "$test_file")"
  if bash "$test_file"; then
    echo ""
  else
    ((FAILED++))
    echo ""
  fi
done
shopt -u nullglob

echo "=== Totale: $TOTAL file di test, $FAILED falliti ==="
[ "$FAILED" -eq 0 ] || exit 1
