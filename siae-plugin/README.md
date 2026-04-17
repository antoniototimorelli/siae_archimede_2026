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

_Da documentare._

---

## Agents

_Da documentare._

---

## Tests

_Da documentare._
