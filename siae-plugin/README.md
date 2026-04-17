# siae-plugin

Plugin Claude Code per il ciclo di sviluppo strutturato del progetto SIAE Hackathon 2026.

---

## Skills

Le skill sono file `SKILL.md` con frontmatter YAML che Claude Code legge per decidere quando attivarle automaticamente. Ogni skill ha una label di rischio (`LOW`, `MEDIUM`, `HIGH`) che riflette il danno massimo possibile se la skill produce output errato.

### brainstorming

**File:** `skills/brainstorming/SKILL.md`

**Perché rischio LOW:** questa skill produce solo testo (analisi, piano, stime) — non esegue comandi né modifica file. Il danno massimo è un piano sbagliato, correggibile prima di scrivere codice.

**Come si attiva:** il frontmatter `description` contiene i TRIGGER (`implementa`, `crea`, `scrivi`, `aggiungi`). Queste parole compaiono in quasi tutte le richieste di sviluppo non banali, quindi Claude invoca la skill automaticamente senza che l'utente debba farlo esplicitamente.

**Cosa garantisce il completamento:** lo step 5 (ottieni conferma) è un gate esplicito — Claude non può uscire dalla skill senza una conferma ricevuta dall'utente.

---

## Hooks

_Da documentare._

---

## Agents

_Da documentare._

---

## Tests

_Da documentare._
