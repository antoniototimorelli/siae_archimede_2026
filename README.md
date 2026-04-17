# siae-archimede-2026

Progetto SIAE Hackathon 2026 composto da due deliverable:

- **Story 1** — `siae-plugin`: plugin Claude Code che impone un ciclo di sviluppo strutturato (TDD, Conventional Commits, review automatica).
- **Story 2** — app SIAE+ (Vue 3 frontend + Express backend) costruita seguendo le convenzioni del plugin.

---

## siae-plugin

Il plugin disciplina ogni sessione di sviluppo Claude Code attraverso tre meccanismi: **hook**, **skill** e **agent**.

### Come funziona

All'avvio di ogni sessione Claude Code l'hook `SessionStart` inietta automaticamente la lista di skill e agent disponibili nel contesto di Claude. Da quel momento in poi Claude sa quando attivare le skill e quali regole rispettare — senza bisogno di prompt manuali.

### Hooks

| Evento | Script | Comportamento |
|--------|--------|---------------|
| `SessionStart` | `session-start.sh` | Scansiona `skills/` e `agents/`, stampa su stdout skill, agent e regole attive. Claude Code li inietta nel contesto della sessione. |
| `PreToolUse(Bash)` | `pre-commit.sh` | Intercetta ogni `git commit`. Valida il messaggio contro il regex Conventional Commits; blocca (exit 2) se non conforme. |

Il gate Conventional Commits accetta soggetti nella forma `type(scope): description` con i tipi: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`. Il `!` opzionale segnala breaking change.

### Skills

Le skill sono file `SKILL.md` con frontmatter YAML. Claude Code le legge e decide autonomamente quando attivarle in base ai trigger dichiarati.

| Skill | Si attiva quando | Cosa fa |
|-------|-----------------|---------|
| `brainstorming` | Parole chiave `implementa`, `crea`, `scrivi`, `aggiungi` + feature > 10 righe | Analizza la feature, stima la complessità, produce un piano in `docs/plans/` se necessario prima di toccare il codice. |
| `implementation` | Claude sta per scrivere o modificare codice sorgente | Impone che esista già un test RED prima di aprire file di produzione; al termine invoca `verification`. |
| `tdd` | Nuova funzione, metodo, componente Vue o modulo TypeScript | Guida il ciclo RED → GREEN → REFACTOR con gate espliciti: output del test fallente, output verde, codice refactored. |
| `verification` | Frasi di chiusura: "ho finito", "è fatto", "posso fare il merge" | Gate finale: suite verde al 100%, working tree pulito, type-check e linter senza errori. Blocca il PASS se anche un solo punto fallisce. |

### Agent

| Agent | Budget | Cosa fa |
|-------|--------|---------|
| `reviewer` | 8 000 token | Riceve un diff o lista di path, classifica i finding in `CRITICAL` / `WARNING` / `INFO` e produce un verdict `PASS` / `FAIL`. Attivato automaticamente dopo il REFACTOR e prima della `verification`, oppure su richiesta esplicita. |

# Installazione

```
npm install ./itsiae-siae-design-system-1.0.3.tgz
npm install vue@^3.5.17 vue-router@^4.5.1 @nuxt/ui@^3.2.0
```
Installare il plugin dal market place con:
```
claude /plugin install
```
