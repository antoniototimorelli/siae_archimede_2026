#!/usr/bin/env bash
# scripts/pre-commit.sh
# Hook PreToolUse(Bash): valida i messaggi di git commit contro Conventional Commits.
# Input: JSON su stdin con chiave tool_input.command.
# Exit 0 = consenti l'operazione; Exit 2 = blocca con messaggio su stderr.

set -euo pipefail

INPUT=$(cat)

# Estrai tool_input.command dal JSON di input. Preferenza: jq (standard dei plugin
# Claude Code); fallback: node (sempre disponibile nell'ambiente Claude Code).
extract_command() {
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$1" | jq -r '.tool_input.command // ""'
  elif command -v node >/dev/null 2>&1; then
    printf '%s' "$1" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{try{process.stdout.write(String(JSON.parse(d)?.tool_input?.command??""))}catch(e){process.stdout.write("")}})'
  else
    echo "pre-commit hook: né jq né node disponibili, impossibile parsare l'input" >&2
    exit 1
  fi
}

CMD=$(extract_command "$INPUT")

# Ignora ogni comando che non sia un git commit
printf '%s' "$CMD" | grep -q "git commit" || exit 0

# git commit --amend senza messaggio inline apre l'editor: delega al flusso locale
if printf '%s' "$CMD" | grep -q -- "--amend"; then
  if ! printf '%s' "$CMD" | grep -qE -- "-m |--message|<<-?'?[A-Z]+"; then
    exit 0
  fi
fi

# git commit -F / --file: messaggio da file, non ispezionabile qui
if printf '%s' "$CMD" | grep -qE -- "(-F |--file[= ])"; then
  exit 0
fi

# Estrazione del subject line del messaggio.
# Il pattern heredoc va gestito per primo: quando il comando è multi-riga
# (cat <<'EOF' ... EOF), i pattern -m "..." matcherebbero solo la prima riga.
MSG=""
if printf '%s' "$CMD" | grep -q "<<'EOF'"; then
  MSG=$(printf '%s' "$CMD" | sed -n "/<<'EOF'/,/^EOF/p" | sed "1d;/^EOF/d" | grep -v '^[[:space:]]*$' | head -1 | sed 's/^[[:space:]]*//')
fi
[ -z "$MSG" ] && MSG=$(printf '%s' "$CMD" | grep -oP '(?<=-m ")[^"]+' | head -1 || true)
[ -z "$MSG" ] && MSG=$(printf '%s' "$CMD" | grep -oP "(?<=-m ')[^']+" | head -1 || true)
[ -z "$MSG" ] && MSG=$(printf '%s' "$CMD" | grep -oP '(?<=--message=")[^"]+' | head -1 || true)
[ -z "$MSG" ] && MSG=$(printf '%s' "$CMD" | grep -oP "(?<=--message=')[^']+" | head -1 || true)
[ -z "$MSG" ] && MSG=$(printf '%s' "$CMD" | grep -oP '(?<=--message ")[^"]+' | head -1 || true)

# Messaggio assente o vuoto: blocca
if [ -z "$MSG" ]; then
  echo "❌ Commit bloccato: messaggio vuoto o non rilevabile." >&2
  echo "   Usa: git commit -m \"tipo(scope): descrizione\"" >&2
  exit 2
fi

# Validazione Conventional Commits: tipo(scope)?!?: descrizione, subject max 72 char
REGEX='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\([^)]+\))?!?: .{1,72}$'
if ! printf '%s' "$MSG" | grep -Eq "$REGEX"; then
  echo "❌ Commit bloccato: messaggio non conforme a Conventional Commits." >&2
  echo "   Ricevuto: \"$MSG\"" >&2
  echo "   Formato:  tipo(scope)?!?: descrizione   (subject max 72 caratteri)" >&2
  echo "   Tipi:     feat | fix | docs | style | refactor | test | chore | perf | ci | build | revert" >&2
  echo "   Esempi:   feat(auth): add login   |   fix: handle null user   |   refactor(core)!: rewrite api" >&2
  exit 2
fi

exit 0
