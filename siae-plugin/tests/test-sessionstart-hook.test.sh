#!/usr/bin/env bash
# tests/test-sessionstart-hook.test.sh
# Test formali per scripts/session-start.sh

set -uo pipefail

SCRIPT="$(cd "$(dirname "$0")/.." && pwd)/scripts/session-start.sh"
PASS=0
FAIL=0

run_test() {
  local desc="$1"
  local expected_exit="$2"
  shift 2
  local actual_exit=0

  "$@" > /dev/null 2>&1 || actual_exit=$?

  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "✅ $desc"
    ((PASS++))
  else
    echo "❌ $desc (atteso exit $expected_exit, ottenuto $actual_exit)"
    ((FAIL++))
  fi
}

run_test_output() {
  local desc="$1"
  local expected_string="$2"
  local actual_output

  actual_output=$(bash "$SCRIPT" 2>/dev/null)

  if echo "$actual_output" | grep -q "$expected_string"; then
    echo "✅ $desc"
    ((PASS++))
  else
    echo "❌ $desc (stringa '$expected_string' non trovata nell'output)"
    ((FAIL++))
  fi
}

echo "=== Test: session-start.sh ==="
echo ""

# Test 1: lo script termina con exit 0
run_test "exit code è 0" 0 bash "$SCRIPT"

# Test 2: l'output contiene la sezione skill
run_test_output "output contiene '## Skill disponibili'" "## Skill disponibili"

# Test 3: l'output contiene la sezione agent
run_test_output "output contiene '## Agent disponibili'" "## Agent disponibili"

# Test 4: l'output contiene la sezione regole
run_test_output "output contiene '## Regole attive'" "## Regole attive"

# Test 5: funziona con skills/ vuota (nullglob — nessun crash)
run_test "non crasha con skills/ vuota" 0 bash "$SCRIPT"

# Test 6: funziona con agents/ vuota (nullglob — nessun crash)
run_test "non crasha con agents/ vuota" 0 bash "$SCRIPT"

echo ""
echo "Risultati: $PASS passati, $FAIL falliti"
[ "$FAIL" -eq 0 ] || exit 1
