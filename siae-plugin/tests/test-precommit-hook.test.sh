#!/usr/bin/env bash
# tests/test-precommit-hook.test.sh
# Test formali per scripts/pre-commit.sh
# Verifica la validazione Conventional Commits su vari pattern di input.

set -uo pipefail

SCRIPT="$(cd "$(dirname "$0")/.." && pwd)/scripts/pre-commit.sh"
PASS=0
FAIL=0

# run_test desc, expected_exit, json_stdin
run_test() {
  local desc="$1"
  local expected_exit="$2"
  local input="$3"
  local actual_exit=0

  echo "$input" | bash "$SCRIPT" > /dev/null 2>&1 || actual_exit=$?

  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "✅ $desc"
    ((PASS++))
  else
    echo "❌ $desc (atteso exit $expected_exit, ottenuto $actual_exit)"
    ((FAIL++))
  fi
}

echo "=== Test: pre-commit.sh ==="
echo ""

# Test 1: commit valido con scope
run_test "commit valido con scope (feat(auth))" 0 \
  '{"tool_input":{"command":"git commit -m \"feat(auth): add login\""}}'

# Test 2: commit valido senza scope
run_test "commit valido senza scope (feat)" 0 \
  '{"tool_input":{"command":"git commit -m \"feat: add login\""}}'

# Test 3: commit con marker di breaking change
run_test "commit con breaking change (feat!:)" 0 \
  '{"tool_input":{"command":"git commit -m \"feat!: remove api v1\""}}'

# Test 4: commit con scope + breaking change
run_test "commit con scope + breaking (refactor(core)!:)" 0 \
  '{"tool_input":{"command":"git commit -m \"refactor(core)!: rewrite api\""}}'

# Test 5: messaggio senza tipo → blocca
run_test "messaggio senza tipo (fixed stuff)" 2 \
  '{"tool_input":{"command":"git commit -m \"fixed stuff\""}}'

# Test 6: tipo non valido → blocca
run_test "tipo non valido (update:)" 2 \
  '{"tool_input":{"command":"git commit -m \"update: something\""}}'

# Test 7: messaggio vuoto → blocca
run_test "messaggio vuoto" 2 \
  '{"tool_input":{"command":"git commit -m \"\""}}'

# Test 8: subject oltre 72 caratteri → blocca
LONG_MSG="feat: $(printf 'a%.0s' {1..80})"
run_test "subject oltre 72 caratteri" 2 \
  "{\"tool_input\":{\"command\":\"git commit -m \\\"$LONG_MSG\\\"\"}}"

# Test 9: comando non-commit passa sempre (exit 0)
run_test "comando non-commit (ls -la)" 0 \
  '{"tool_input":{"command":"ls -la"}}'

# Test 10: heredoc con subject valido (stile Claude Code)
run_test "heredoc con subject valido" 0 \
  '{"tool_input":{"command":"git commit -m \"$(cat <<'"'"'EOF'"'"'\nfeat(plugin): add conventional commits gate\n\nBody here.\nEOF\n)\""}}'

# Test 11: heredoc con subject invalido → blocca
run_test "heredoc con subject invalido" 2 \
  '{"tool_input":{"command":"git commit -m \"$(cat <<'"'"'EOF'"'"'\nrandom text here\nEOF\n)\""}}'

echo ""
echo "Risultati: $PASS passati, $FAIL falliti"
[ "$FAIL" -eq 0 ] || exit 1
