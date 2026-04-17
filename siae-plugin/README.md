# siae-plugin

Plugin Claude Code per il ciclo di sviluppo strutturato del progetto SIAE Hackathon 2026.

---

## Skills

Le skill sono file `SKILL.md` con frontmatter YAML che Claude Code legge per decidere quando attivarle automaticamente. Ogni skill ha una label di rischio (`LOW`, `MEDIUM`, `HIGH`) che riflette il danno massimo possibile se la skill produce output errato.

### brainstorming

**File:** `skills/brainstorming/SKILL.md`

**Perché rischio MEDIUM:** la skill produce solo testo, ma lo step 5 può creare un file in `docs/plans/` — azione reversibile ma concreta. Il rischio sale rispetto a una skill puramente analitica.

**Come si attiva:** il frontmatter `description` contiene due TRIGGER: parole chiave (`implementa`, `crea`, `scrivi`, `aggiungi`) + soglia di complessità (più di 10 righe). Il doppio filtro evita l'attivazione su modifiche banali.

**Cosa garantisce il completamento:** lo step 5 forza una decisione esplicita sulla complessità — se alta, Claude deve scrivere un piano in `docs/plans/` prima di procedere al codice.

---

## Hooks

Gli hook sono script che Claude Code invoca automaticamente in risposta a eventi del suo ciclo di vita. La configurazione risiede in `hooks/hooks.json`. Ogni hook riceve un oggetto JSON su stdin e può:
- terminare con exit code `0` per consentire l'operazione,
- terminare con exit code `2` per **bloccare** l'operazione e restituire l'output di stderr a Claude come messaggio di errore.

### SessionStart

**Script:** `scripts/session-start.sh`
**Evento:** `SessionStart` (si attiva all'apertura di ogni sessione Claude Code nella directory del progetto).
**Rischio:** **LOW** — lo script non modifica file e produce solo stdout; nessun side effect oltre l'iniezione di contesto.

**Comportamento:**
- Scansiona `skills/` ed estrae `name`, `type` e riga `TRIGGER:` dal frontmatter di ogni `SKILL.md`.
- Scansiona `agents/` ed estrae `name` e `max_tokens` dal frontmatter di ogni agent.
- Stampa su stdout un riepilogo strutturato (sezioni: *Skill disponibili*, *Agent disponibili*, *Regole attive*).
- Claude Code cattura l'output e lo inietta come contesto persistente per tutta la sessione.

**Perché serve:** senza questo hook Claude non sa che il plugin esiste. Con l'hook, fin dal primo messaggio Claude vede la lista completa di skill e agent da usare e le regole operative attive.

**Come testarlo:**
```bash
bash siae-plugin/scripts/session-start.sh
```
L'output deve contenere le sezioni `## Skill disponibili`, `## Agent disponibili`, `## Regole attive`.

---

### PreToolUse(Bash) — Conventional Commits gate

**Script:** `scripts/pre-commit.sh`
**Evento:** `PreToolUse` con `matcher: "Bash"` (si attiva **prima** di ogni invocazione del tool `Bash`).
**Rischio:** **MEDIUM** — lo script può **bloccare** un'operazione (exit 2). Un falso positivo impedisce a Claude di fare commit legittimi; un falso negativo lascia passare commit non conformi. La label `MEDIUM` riflette il fatto che il danno è reversibile (si riscrive il messaggio e si ritenta), ma interrompe il flusso.

**Comportamento:**
1. Legge JSON da stdin ed estrae `tool_input.command` (parser: `jq` se presente, altrimenti `node` — sempre disponibile nell'ambiente Claude Code).
2. **Se il comando non contiene `git commit` → exit 0** (il comando non è affar nostro).
3. **Se è un `git commit --amend` senza `-m`/`--message`/heredoc → exit 0** (apre l'editor: delega al flusso locale).
4. **Se è un `git commit -F file` → exit 0** (messaggio da file, non ispezionabile).
5. Estrae il **subject** del messaggio nell'ordine:
   - heredoc `cat <<'EOF' ... EOF` → prima riga non vuota dopo il marker (pattern tipico di Claude Code);
   - `-m "subject"` / `-m 'subject'`;
   - `--message="subject"` / `--message='subject'` / `--message "subject"`.
6. **Se il subject è vuoto → exit 2** con messaggio di aiuto.
7. Valida il subject contro il regex Conventional Commits:
   ```
   ^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\([^)]+\))?!?: .{1,72}$
   ```
   - tipi ammessi: `feat | fix | docs | style | refactor | test | chore | perf | ci | build | revert`;
   - scope opzionale fra parentesi;
   - `!` opzionale per breaking change (es. `feat!:` o `feat(core)!:`);
   - descrizione obbligatoria, max 72 caratteri sul subject.
8. Su fallimento → exit 2 con messaggio su stderr che mostra: messaggio ricevuto, formato atteso, tipi validi, esempi.

**Scelte consapevoli:**
- `grep -oP` (Perl-regex) è usato per le lookbehind: richiede GNU grep. OK su Windows/git-bash e Linux.
- Il pattern heredoc è limitato a `<<'EOF'` (stile generato da Claude Code); `<<EOF` senza apici e `<<-EOF` non sono gestiti.
- Escape di virgolette annidate dentro `-m "..."` non è gestito (caso raro).

**Come testarlo manualmente:**
```bash
# Commit valido → exit 0
echo '{"tool_input":{"command":"git commit -m \"feat(hooks): add pre-commit gate\""}}' \
  | bash siae-plugin/scripts/pre-commit.sh
echo "Exit: $?"   # atteso: 0

# Commit non conforme → exit 2 e messaggio su stderr
echo '{"tool_input":{"command":"git commit -m \"fixed stuff\""}}' \
  | bash siae-plugin/scripts/pre-commit.sh
echo "Exit: $?"   # atteso: 2
```

---

## Agents

Gli agent sono file Markdown in `agents/` con system prompt dedicato e budget di token esplicito nel frontmatter. Claude delega loro compiti in sotto-sessione con contesto separato, evitando di inquinare il contesto principale.

### reviewer

**File:** `agents/reviewer.md`
**Budget:** `max_tokens: 8000` (dichiarato nel frontmatter, conforme al vincolo della traccia §3.5).
**Model:** `sonnet` — bilancia qualità dell'analisi e costo per review di diff medi.
**Tools:** `Read`, `Grep`, `Glob` (solo read-only: l'agent non modifica file né esegue comandi).
**Rischio:** **MEDIUM** — non modifica file ma il suo verdict `PASS`/`FAIL` può sbloccare o bloccare il gate di verification.

**Comportamento:** riceve un diff o una lista di path, classifica ogni finding in `CRITICAL` / `WARNING` / `INFO` e produce un report nel formato:

```markdown
## Review Report
### CRITICAL
- [file:riga] Problema -> Fix suggerito
### WARNING
- [file:riga] Problema -> Fix suggerito
### INFO
- [file:riga] Nota
### Verdict: PASS | FAIL
```

**Come si attiva:**
- Automaticamente: step 3 della skill `implementation` (dopo la fase REFACTOR del ciclo TDD) e come gate finale prima della skill `verification`.
- Manualmente: l'utente chiede `"review"`, `"revisiona"`, `"controlla il codice"`.

**Criteri di review specifici** al contesto SIAE+ (Story 2): tipizzazione TypeScript esplicita (RNF-06), separazione routes/controllers/services (RNF-05), password non in chiaro + JWT da env (RNF-04), persistenza `fs` su `users.json` (RNF-02), coverage vitest >= 70% (RNF-08).

---

## Tests

I test degli hook sono in `tests/`. Il dispatcher globale è `tests/test.sh`: esegue tutti i file `*.test.sh` della cartella in sequenza, aggrega i risultati e ritorna exit 0 se tutto passa, 1 altrimenti.

**Esecuzione:**
```bash
bash siae-plugin/tests/test.sh
```

**File di test attuali:**

| File | Target | Casi |
|------|--------|------|
| `tests/test-sessionstart-hook.test.sh` | `scripts/session-start.sh` | 6 |
| `tests/test-precommit-hook.test.sh` | `scripts/pre-commit.sh` | 11 |

**Convenzioni:**
- Ogni file di test usa helper `run_test` con contatori `PASS`/`FAIL` ed emoji `✅`/`❌`.
- Un file di test termina con exit 0 se tutti i casi passano, 1 altrimenti.
- Per aggiungere un nuovo test suite: creare `tests/test-<nome>.test.sh` — il dispatcher lo rileva automaticamente via glob.

**Dipendenze runtime:**
- `bash` (POSIX+, compatibile con git-bash su Windows);
- `grep` GNU (per il supporto `-P`);
- `sed`, `jq` *oppure* `node` (per il parsing JSON dell'input degli hook).
