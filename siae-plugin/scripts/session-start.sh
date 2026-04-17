#!/usr/bin/env bash
# Eseguito automaticamente all'avvio di ogni sessione Claude Code.
# Tutto ciò che stampa su stdout diventa contesto persistente per Claude.

set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== SIAE-ARCHIMEDE-PLUGIN ATTIVO ==="
echo ""

echo "## Skill disponibili"
shopt -s nullglob
for skill_dir in "$PLUGIN_DIR"/skills/*/; do
  if [ -f "$skill_dir/SKILL.md" ] && [ -s "$skill_dir/SKILL.md" ]; then
    name=$(sed -n 's/^name: *//p' "$skill_dir/SKILL.md" | head -1 || true)
    trigger=$(grep -m1 "TRIGGER:" "$skill_dir/SKILL.md" | sed 's/.*TRIGGER: *//' || true)
    echo "  - ${name:-$(basename "$skill_dir")}: $trigger"
  fi
done
shopt -u nullglob

echo ""
echo "## Agent disponibili"
shopt -s nullglob
for agent in "$PLUGIN_DIR"/agents/*.md; do
  if [ -s "$agent" ]; then
    name=$(sed -n 's/^name: *//p' "$agent" | head -1 || true)
    budget=$(sed -n 's/^max_tokens: *//p' "$agent" | head -1 || true)
    echo "  - ${name:-$(basename "$agent" .md)} (budget: ${budget:-non specificato} tokens)"
  fi
done
shopt -u nullglob

echo ""
echo "## Regole attive"
echo "  - I commit devono seguire Conventional Commits (validati da hook)"
echo "  - Le skill obbligatorie non si bypassano"
echo "  - Usa /brainstorming prima di implementare qualsiasi feature non banale"
echo "  - Usa /tdd per ogni nuova funzione, metodo o componente"
echo "  - Usa /verification prima di dichiarare un task completato"
echo ""

exit 0
