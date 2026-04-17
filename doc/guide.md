# Guida Semplice — Hackathon SIAE 2026

> **Hai 8 ore in totale.** Devi consegnare **due cose insieme**: un plugin per Claude Code (Story 1) e un'app web chiamata SIAE+ (Story 2). Le due cose valgono uguale.

---

## Prima di tutto: leggi la documentazione (non saltare questo)

Prima di scrivere una sola riga di codice, leggi questi link:

1. Come funzionano gli **Hook** di Claude Code
2. Come funzionano le **Skill** di Claude Code
3. Il progetto **Superpowers** di Jesse Vincent su GitHub (è il modello di riferimento)
4. Il **README plugin** di Anthropic su GitHub

Non devi copiare, devi capire i pattern.

---

## PARTE 1 — Il Plugin (Story 1, ~4 ore)

### Cos'è il plugin?

Un plugin per Claude Code è un insieme di file che "istruisce" Claude su come comportarsi mentre sviluppi. Non ha interfaccia grafica: agisce in background intercettando le azioni di Claude.

### Struttura delle cartelle da creare

```
mio-plugin/
├── .claude-plugin/
│   └── plugin.json          ← info sul plugin (nome, versione, autore)
├── hooks/
│   └── hooks.json           ← dice quali script eseguire e quando
├── skills/
│   ├── brainstorming/SKILL.md
│   ├── implementation/SKILL.md
│   ├── tdd/SKILL.md
│   └── verification/SKILL.md
├── agents/
│   └── reviewer.md
├── scripts/
│   └── *.sh                 ← gli script bash richiamati dagli hook
├── tests/
│   └── *.test.sh            ← test per verificare che gli hook funzionino
└── README.md
```

---

### Step 0 — Crea il CLAUDE.md (10 min)

Il `CLAUDE.md` è il file che Claude Code legge automaticamente all'avvio in ogni progetto. È la memoria persistente del progetto: dice a Claude cosa sta costruendo, quali regole seguire, quali comandi usare.

**Cosa deve contenere il tuo CLAUDE.md:**
- Il nome e lo scopo del progetto
- La struttura delle cartelle
- I comandi per installare e testare (`npm install`, `bash tests/...`)
- Le regole fondamentali (Conventional Commits, TDD, no codice senza test)
- I riferimenti alle skill e agli agent disponibili

> Prompt da inviarmi:
> ```
> Crea un file CLAUDE.md nella root di questo progetto che serva da
> memoria persistente per Claude Code. Il progetto è un plugin chiamato
> siae-plugin che disciplina il ciclo di sviluppo con hook, skill
> e agent. Includi: scopo del progetto, struttura cartelle, comandi utili
> (installazione e test), regole obbligatorie (Conventional Commits,
> TDD, no codice senza test), lista skill disponibili e agent disponibili.
> Lo stile deve essere conciso e operativo, non documentativo. Fai riferimento
> al file "Traccia_Hackathon_SIAE2026_v2.pdf" per essere guidato nel processo.
> ```

---

### Step 1 — Setup iniziale (30 min)

1. Crea la struttura di cartelle sopra (puoi chiedere a Claude Code di farlo per te).
2. Crea `plugin.json` con nome, versione e autore.
3. Inizializza git: `git init`
4. Fai il primo commit: `chore: scaffold plugin structure`

> Prompt da inviarmi:
> ```
> Crea la struttura base del plugin Claude Code in questa directory.
> Devo avere: .claude-plugin/plugin.json (con name, version, description,
> author), hooks/hooks.json (vuoto per ora), le cartelle skills/,
> agents/, scripts/, tests/, e un README.md con titolo e descrizione
> placeholder. Poi esegui git init e fai il primo commit con messaggio
> "chore: scaffold plugin structure".
> ```

---

### Step 2 — Primo Hook: SessionStart (30 min)

**Cosa fa:** quando apri Claude Code in una cartella, questo script gira in automatico e "avvisa" Claude di quali skill e agent hai disponibili.

**Come funziona:**
- Crea `scripts/session-start.sh`
- Lo script legge le cartelle `skills/` e `agents/` ed elenca il loro contenuto su stdout
- Claude legge quell'output e lo usa come contesto per tutta la sessione
- Registra lo hook in `hooks/hooks.json` sotto la chiave `"SessionStart"`

**Test:** riavvia Claude Code nella directory e chiedi "cosa sai di questo progetto?". Deve rispondere citando le skill.

**Commit:** `feat(hooks): add session-start hook`

> Prompt da inviarmi:
> ```
> Crea il SessionStart hook per il plugin. Lo script scripts/session-start.sh
> deve: (1) scansionare skills/**/SKILL.md ed estrarre name e la prima
> riga TRIGGER dal frontmatter YAML, (2) scansionare agents/*.md ed
> estrarre name e max_tokens, (3) stampare su stdout un riepilogo
> strutturato con titolo "=== PLUGIN ATTIVO ===", lista skill con trigger,
> lista agent con budget, regole attive. Poi aggiorna hooks/hooks.json
> per registrare questo hook su SessionStart. Infine scrivi almeno
> 1 test in tests/test-session-start.sh che verifica che lo script
> produca output non vuoto. Fai il commit con "feat(hooks): add
> session-start hook".
> ```

---

### Step 3 — Secondo Hook: PreToolUse (Bash) — blocca i commit brutti (30 min)

**Cosa fa:** ogni volta che Claude sta per eseguire `git commit`, questo hook controlla che il messaggio segua il formato **Conventional Commits**.

**Formato richiesto:** `tipo(scope): descrizione`
- Tipi validi: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`
- Esempio valido: `feat(auth): add login page`
- Esempio non valido: `fixed stuff`

**Come funziona:**
- Crea `scripts/pre-commit.sh`
- Lo script legge il comando bash dal JSON in stdin
- Se il comando contiene `git commit`, valida il messaggio con una regex
- Se non è valido: stampa errore su stderr ed esegue `exit 2` (blocca Claude)
- Se è valido: `exit 0` (lascia passare)
- Registra lo hook in `hooks.json` sotto `"PreToolUse"` con `"matcher": "Bash"`

**Test:** prova a fare un commit con messaggio sbagliato e verifica che venga bloccato.

**Commit:** `feat(hooks): add pre-commit conventional commits gate`

> Prompt da inviarmi:
> ```
> Crea il PreToolUse hook per validare i commit. Lo script
> scripts/pre-commit.sh deve: (1) leggere JSON da stdin, (2) ignorare
> se il comando non contiene "git commit", (3) estrarre il messaggio
> di commit, (4) validarlo con la regex Conventional Commits
> (tipi: feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert),
> (5) se non valido: stampare messaggio di errore su stderr e uscire
> con exit 2, (6) se valido: exit 0. Aggiorna hooks/hooks.json per
> registrare questo hook su PreToolUse con matcher "Bash". Poi crea
> tests/test-pre-commit.sh con almeno 6 test case: commit valido,
> commit non valido, comando non-commit, commit senza scope, tipo
> non valido, messaggio vuoto. Fai il commit con "feat(hooks):
> add pre-commit conventional commits gate".
> ```

---

### Step 4 — Le 4 Skill obbligatorie (60 min)

Ogni skill è un file `SKILL.md` con:
1. Un frontmatter YAML con `name` e `description` (che contiene le condizioni TRIGGER)
2. Un titolo visuale
3. Step numerati e concreti che Claude deve seguire
4. Una label di rischio: `LOW`, `MEDIUM` o `HIGH`

**Skill 1 — brainstorming**
- Si attiva quando l'utente dice "implementa", "crea", "scrivi", "aggiungi una feature"
- Forza Claude a: definire il problema, elencare i casi limite, valutare approcci alternativi, stimare la complessità
- Claude non scrive codice finché non ha un piano

**Skill 2 — implementation**
- Si attiva quando Claude sta per scrivere codice
- Definisce regole concrete: come si chiamano le variabili, struttura dei file, lunghezza massima delle funzioni, regole di import
- Regole specifiche, non vaghe (es. "usa snake_case per le funzioni Python")

**Skill 3 — tdd**
- Si attiva quando Claude deve implementare una funzione o componente
- Impone il ciclo: RED (scrivi il test, verifica che fallisce) → GREEN (scrivi il codice minimo per far passare il test) → REFACTOR (pulizia)
- Gli step non si saltano

**Skill 4 — verification**
- Si attiva quando Claude o tu dite "ho finito", "è fatto", "posso fare il merge"
- Forza Claude a verificare concretamente che tutto funzioni prima di dichiarare il task completato
- Se anche un solo punto non è verde, si torna indietro

**Commit:** `feat(skills): add brainstorming, implementation, tdd, verification`

> **Prompt Skill 1 — brainstorming:**
> ```
> Crea siae-plugin/skills/brainstorming/SKILL.md.
> Frontmatter YAML con: name: brainstorming, description che includa
> TRIGGER (utente dice "implementa", "crea", "scrivi", "aggiungi")
> e NON-TRIGGER (domande teoriche, richieste di spiegazione, debug).
> Titolo visuale. Step numerati e concreti:
> 1. Riformula il problema in una frase
> 2. Elenca i casi limite (almeno 3)
> 3. Proponi 2-3 approcci alternativi con pro/contro
> 4. Stima la complessità (righe, file, tempo)
> 5. Ottieni conferma prima di procedere
> Label rischio: LOW. Claude non scrive codice finché lo step 5 non è completato.
> ```

> **Prompt Skill 2 — implementation:**
> ```
> Crea siae-plugin/skills/implementation/SKILL.md.
> Frontmatter YAML con: name: implementation, description che includa
> TRIGGER (Claude sta per scrivere o modificare codice Vue 3 / TypeScript)
> e NON-TRIGGER (brainstorming, test, refactor puro).
> Titolo visuale. Step numerati e concreti con regole specifiche:
> 1. Naming: PascalCase per componenti Vue, camelCase per funzioni e variabili,
>    SCREAMING_SNAKE per costanti, kebab-case per file non-componenti
> 2. Struttura file Vue: <script setup lang="ts"> prima di <template>
> 3. Funzioni: massimo 20 righe; se supera, estrai helper
> 4. Import: alias @/ per src/, nessun import relativo oltre un livello (..)
> 5. Props e emits sempre tipizzati con defineProps<T>() / defineEmits<T>()
> 6. Nessun any; usa unknown + type guard se il tipo è incerto
> Label rischio: MEDIUM.
> ```

> **Prompt Skill 3 — tdd:**
> ```
> Crea siae-plugin/skills/tdd/SKILL.md.
> Frontmatter YAML con: name: tdd, description che includa
> TRIGGER (Claude deve implementare una funzione, un componente o un endpoint)
> e NON-TRIGGER (modifiche a config, documentazione, stili CSS).
> Titolo visuale. Step numerati non saltabili:
> 1. RED — scrivi il test che descrive il comportamento atteso;
>    esegui la suite e verifica che il nuovo test fallisca
> 2. GREEN — scrivi il codice minimo (e solo quello) per far passare il test;
>    riesegui la suite e verifica che passi
> 3. REFACTOR — rimuovi duplicazioni, migliora naming, rispetta le regole
>    della skill implementation; riesegui la suite dopo ogni modifica
> Regola: se salti uno step devi ricominciare dal RED.
> Label rischio: HIGH.
> ```

> **Prompt Skill 4 — verification:**
> ```
> Crea siae-plugin/skills/verification/SKILL.md.
> Frontmatter YAML con: name: verification, description che includa
> TRIGGER (chiunque dice "ho finito", "è fatto", "posso fare il merge",
> "task completato") e NON-TRIGGER (mid-task, durante brainstorming o TDD).
> Titolo visuale. Step numerati con prove concrete richieste:
> 1. Esegui la suite di test — mostra output, deve essere verde al 100%
> 2. Controlla che non esistano file modificati non committati (git status pulito)
> 3. Verifica che il codice rispetti le regole della skill implementation
> 4. Esegui il linter/type-check senza errori
> 5. Dichiara PASS solo se tutti i punti sopra sono verdi;
>    anche un solo punto rosso → torna allo step che ha fallito
> Label rischio: HIGH.
> ```

---

### Step 5 — L'Agent obbligatorio: reviewer (30 min)

**Cos'è un agent?** Un file Markdown in `agents/` con un system prompt dedicato. Claude può delegarlo per fare revisioni del codice in una sotto-sessione separata.

**Regola critica:** ogni agent DEVE avere `max_tokens: 8000` (o simile) nel frontmatter. Senza budget, l'agent consuma tutto il contesto.

**reviewer.md deve:**
- Avere nel frontmatter: `name`, `description`, `model`, `max_tokens`, `tools: [Read, Grep, Glob]`
- Ricevere un file o un diff e restituire un report strutturato con: problemi CRITICAL, WARNING, INFO
- Ogni finding deve indicare: problema, suggerimento, file e riga
- Dare un verdetto finale: PASS o FAIL

**Commit:** `feat(agents): add reviewer agent with token budget`

> Prompt da inviarmi:
> ```
> Crea l'agent reviewer in agents/reviewer.md. Deve avere nel frontmatter:
> name, description, model (sonnet), max_tokens (8000), tools (Read, Grep, Glob).
> Il system prompt deve istruire l'agent a: analizzare solo il codice
> passato, classificare ogni finding come CRITICAL/WARNING/INFO, per
> ognuno indicare problema + suggerimento fix + file:riga, concludere
> con un verdetto PASS o FAIL. Il formato di output deve essere un
> blocco Markdown strutturato con sezioni per CRITICAL, WARNING, INFO
> e Verdict. Fai il commit con "feat(agents): add reviewer agent
> with token budget".
> ```

---

### Step 6 — I test degli hook (30 min)

Devi avere **almeno 6 test case** funzionanti. Crea `tests/test-pre-commit.sh`:

Esempi di test da scrivere:
1. Commit valido (`feat(auth): add login`) → deve passare (exit 0)
2. Commit non valido (`fixed stuff`) → deve essere bloccato (exit 2)
3. Comando bash che non è un commit (`ls -la`) → deve passare (exit 0)
4. Commit senza scope (`feat: add login`) → deve passare (exit 0)
5. Commit con tipo non valido (`update: something`) → deve essere bloccato (exit 2)
6. Messaggio vuoto → deve essere bloccato (exit 2)

**Commit:** `test(hooks): add 6 test cases for pre-commit hook`

> Prompt da inviarmi:
> ```
> Controlla che tests/test-pre-commit.sh contenga almeno 6 test case
> reali e funzionanti. Se mancano, aggiungili. I test devono usare
> una funzione run_test che esegue lo script con input JSON simulato
> e confronta l'exit code atteso. Esegui i test con "bash tests/test-pre-commit.sh"
> e mostrami l'output. Se tutti passano, fai il commit con
> "test(hooks): add 6 test cases for pre-commit hook".
> ```

---

### Step 7 — README e pubblicazione (30 min)

Il README deve spiegare:
- Cosa fa il plugin
- Come si installa (`claude plugin add --path ./mio-plugin`)
- Come si usa
- Perché hai fatto certe scelte

Pubblica su GitHub come repo **privato**. Verifica che funzioni su una macchina pulita.

**Bonus (se hai tempo):** aggiungi `.github/workflows/test.yml` per far girare i test in automatico su ogni push.

> Prompt da inviarmi:
> ```
> Scrivi il README.md del plugin. Deve contenere: (1) cosa fa il plugin
> e perché è utile, (2) prerequisiti, (3) istruzioni di installazione
> con il comando "claude plugin add --path ./mio-plugin", (4) lista
> hook attivi e cosa fanno, (5) lista skill con i loro trigger,
> (6) lista agent con budget, (7) come eseguire i test,
> (8) perché ho scelto questa struttura (motivazioni architetturali).
> Tono: conciso e tecnico, non marketing. Fai il commit con
> "docs: add complete README".
> [OPZIONALE] Crea anche .github/workflows/test.yml che installa jq
> e fa girare tutti gli script in tests/ su ogni push e pull request.
> ```

---

## PARTE 2 — L'app SIAE+ (Story 2, ~4 ore)

### Cos'è SIAE+?

Un'app mobile (consegnata come web app) per la registrazione di nuovi utenti SIAE. Deve avere un flusso di registrazione in 8 step.

### Stack tecnologico obbligatorio

| Cosa | Tecnologia |
|------|-----------|
| Frontend | Vue 3 (Composition API) + Capacitor |
| Backend | Node.js 18+ + Express + TypeScript |
| Database | File `users.json` (niente ORM, niente database reali) |
| Auth | JWT (JSON Web Token) |

### Struttura del progetto

```
siae-plus/
├── frontend/   ← Vue 3 + Capacitor
└── backend/    ← Express + TypeScript
    ├── routes/
    ├── controllers/
    └── services/
```

---

### Step 1 — Backend: setup (30 min)

1. Crea `backend/` con struttura `routes/`, `controllers/`, `services/`
2. Configura TypeScript (no `any` non giustificato)
3. Crea il file `users.json` vuoto: `[]`
4. Crea `.env` con `JWT_SECRET=tua_chiave_segreta`

> Prompt da inviarmi:
> ```
> Crea il backend Express + TypeScript per l'app SIAE+. Struttura:
> backend/src/routes/, backend/src/controllers/, backend/src/services/.
> Configura: tsconfig.json (strict mode), package.json con script
> "dev" (ts-node-dev) e "build" (tsc), .env con JWT_SECRET placeholder,
> .gitignore che esclude .env e node_modules, users.json vuoto (array []).
> Niente ORM, niente database: tutto passa da fs nativo su users.json.
> Fai il commit con "chore(backend): scaffold express typescript project".
> ```

---

### Step 2 — Backend: endpoint di registrazione (30 min)

Endpoint: `POST /api/register`

Cosa deve fare:
1. Ricevere i dati dell'utente (nome, cognome, codice fiscale, email, password, ecc.)
2. Controllare che l'email e il codice fiscale non siano già presenti in `users.json`
3. Se esistono già → risponde con errore "utente già esistente, vai al login"
4. Se non esistono → salva l'utente in `users.json` (password hashata, NON in chiaro)
5. Restituisce conferma

> Prompt da inviarmi:
> ```
> Implementa l'endpoint POST /api/register nel backend. Deve:
> (1) ricevere nel body: firstName, lastName, fiscalCode, email,
> password, phone, address, repertoires (array), photo (base64, opzionale),
> birthDate (per calcolo età), (2) validare che i campi obbligatori
> siano presenti, altrimenti 400 Bad Request, (3) leggere users.json
> con fs.readFileSync, (4) verificare che email e fiscalCode non
> esistano già, altrimenti 409 con messaggio "utente già esistente",
> (5) hashare la password con bcrypt, (6) salvare il nuovo utente
> in users.json con fs.writeFileSync, (7) rispondere 201 con conferma.
> TypeScript tipizzato, no any. Commenta ogni endpoint con input/output atteso.
> Fai il commit con "feat(backend): add register endpoint".
> ```

---

### Step 3 — Backend: endpoint di login (20 min)

Endpoint: `POST /api/login`

Cosa deve fare:
1. Ricevere email e password
2. Cercare l'utente in `users.json`
3. Se le credenziali sono sbagliate → errore generico (non specificare se è sbagliata l'email o la password)
4. Se corrette → restituisce un JWT con scadenza 1 ora, firmato con `JWT_SECRET`

> Prompt da inviarmi:
> ```
> Implementa l'endpoint POST /api/login nel backend. Deve:
> (1) ricevere email e password nel body, (2) cercare l'utente in
> users.json per email, (3) se non trovato o password errata:
> rispondere 401 con messaggio generico (non dire quale dei due
> è sbagliato), (4) se corretto: generare un JWT firmato con
> JWT_SECRET da .env, scadenza 1 ora, payload con userId e email,
> (5) rispondere 200 con { token }. TypeScript tipizzato, no any.
> Fai il commit con "feat(backend): add login endpoint with JWT".
> ```

---

### Step 4 — Frontend: schermata di login (20 min)

- Campi: email e password
- In caso di errore, mostra messaggio generico
- Dopo il login, salva il JWT **in memoria** (non in localStorage)

> Prompt da inviarmi:
> ```
> Crea la schermata di login nel frontend Vue 3. Componente
> frontend/src/views/LoginView.vue con: (1) form con campi email
> e password, (2) validazione frontend (email valida, password
> non vuota), (3) chiamata POST /api/login, (4) se errore: mostra
> messaggio generico "Credenziali non valide" senza specificare quale
> campo è sbagliato, (5) se successo: salva il JWT in un Pinia store
> (NON in localStorage), poi redirect alla home. Mobile responsive.
> Fai il commit con "feat(frontend): add login view".
> ```

---

### Step 5 — Frontend: flusso di registrazione in 8 step (120 min)

Ogni step è un componente Vue separato. L'utente non può andare al prossimo step senza aver validato quello corrente. Mostra un indicatore di progresso (stepper o barra).

**Step 1 — Dati anagrafici:** Nome (solo lettere), Cognome (solo lettere), Codice fiscale (formato valido)

**Step 2 — Credenziali:** Email (formato valido), Password (min 8 car, 1 maiuscola, 1 numero), Conferma password

**Step 3 — Dati di contatto:** Numero di telefono (min 9 cifre), Indirizzo (testo libero)

**Step 4 — Caricamento foto (opzionale):** Upload immagine; se sfocata o non in primo piano → errore

**Step 5 — Scelta repertorio:** Selezione multipla tra Musica, Cinema, DOR, Lirica, Opere Letterarie, Arti Figurative

**Step 6 — Riepilogo e conferma:** Tutti i dati in sola lettura, pulsante Modifica, pulsante Conferma registrazione

**Step 7 — Pagamento (opzionale):** Under 30 → messaggio gratuità; 30+ → avviso quota da accettare

**Step 8 — Conferma finale (opzionale):** Stato registrazione (successo/errore), pulsante redirect al login

> Prompt da inviarmi (da eseguire step per step o tutto insieme):
> ```
> Crea il flusso di registrazione multi-step per l'app SIAE+.
> Ogni step è un componente Vue separato in frontend/src/components/steps/.
> C'è un componente padre RegisterView.vue che gestisce la navigazione
> tra gli step, mostra una barra di progresso e impedisce di avanzare
> se lo step corrente non è validato.
>
> Step da implementare (almeno 1-6 obbligatori):
> - Step1Anagrafica.vue: firstName (solo lettere), lastName (solo lettere), fiscalCode (regex CF italiano)
> - Step2Credentials.vue: email (formato valido), password (min 8, 1 maiusc, 1 numero), confirmPassword
> - Step3Contact.vue: phone (min 9 cifre numeriche), address (testo libero)
> - Step4Photo.vue: upload immagine, conversione in base64, validazione presenza primo piano
> - Step5Repertoire.vue: selezione multipla dei 6 repertori SIAE
> - Step6Summary.vue: riepilogo sola lettura, tasto Modifica per tornare a step specifico, tasto Conferma
> - Step7Payment.vue (opzionale): logica under/over 30
> - Step8Confirm.vue (opzionale): stato finale e redirect al login
>
> Tutta la validazione avviene lato frontend prima dell'invio.
> Lo stato condiviso tra gli step va in un Pinia store.
> Fai un commit per ogni step: "feat(frontend): add step N - descrizione".
> ```

---

### Step 6 — Test frontend con Vitest (30 min)

Devi raggiungere **almeno il 70%** di copertura su: Branches, Lines, Functions, Statements.

Scrivi test reali per le validazioni dei form e la logica dei componenti.

> Prompt da inviarmi:
> ```
> Configura Vitest nel frontend con soglie di coverage al 70% per
> branches, lines, functions e statements. Poi scrivi i test per:
> (1) la logica di validazione di ogni step (almeno i campi
> obbligatori: fiscalCode, email, password, phone), (2) la navigazione
> dello stepper (non avanza se validazione fallisce, avanza se passa),
> (3) il Pinia store (dati salvati correttamente tra gli step).
> Esegui "npm run test -- --coverage" e mostrami il report. Se la
> coverage è sotto il 70%, aggiungi i test mancanti.
> Fai il commit con "test(frontend): add vitest coverage at 70%".
> ```

---

### Step 7 — README e setup locale (20 min)

Il README deve contenere:
- Come avviare il progetto: `npm install` e `npm run dev` (sia frontend che backend)
- Le variabili d'ambiente richieste (es. `JWT_SECRET`)
- La descrizione degli endpoint API disponibili

> Prompt da inviarmi:
> ```
> Scrivi il README.md nella root del progetto SIAE+. Deve contenere:
> (1) descrizione dell'app, (2) prerequisiti (Node 18+), (3) istruzioni
> di setup per frontend e backend (npm install + npm run dev),
> (4) variabili d'ambiente richieste con esempio, (5) descrizione
> degli endpoint: POST /api/register e POST /api/login con
> input/output attesi, (6) come girare i test frontend.
> Fai il commit con "docs: add project README with setup instructions".
> ```

---

## Punti bonus (se hai tempo)

- Hook aggiuntivo: **TDD gate** — blocca Claude se prova a scrivere codice senza un test già esistente
- Hook aggiuntivo: **session log** — dopo ogni operazione, salva un log in `.session-log.jsonl`
- Skill aggiuntiva: **git-workflow** — naming branch, checklist pre-push
- Skill aggiuntiva: **ci-cd** — guida Claude a configurare GitHub Actions
- Agent aggiuntivo: **test-writer** — genera test a partire da un'interfaccia
- Sicurezza backend: hashing password (es. bcrypt), JWT firmato con variabile d'ambiente
- Schermata post-login con nome, cognome, repertori e foto, più pulsante logout
- Validazione dei dati anche lato backend (non solo frontend)
- GitHub Action che fa girare i test automaticamente su ogni push

> Prompt da inviarmi (bonus hook):
> ```
> Aggiungi due hook opzionali al plugin:
> 1. TDD gate (PreToolUse su Write|Edit): prima che Claude scriva o
>    modifichi un file .ts/.vue, controlla che esista già un file di
>    test corrispondente (es. Component.test.ts per Component.vue).
>    Se non esiste, exit 2 con messaggio "scrivi prima il test".
>    Non si applica ai file .test.ts, .spec.ts e ai file di config.
> 2. Session log (PostToolUse): dopo ogni tool use, appende a
>    .session-log.jsonl una riga JSON con: timestamp, tool_name,
>    file coinvolto (se presente), esito.
> Aggiorna hooks.json, aggiungi test per entrambi, fai i commit
> con "feat(hooks): add tdd-gate hook" e "feat(hooks): add session-log hook".
> ```

---

## Criteri di valutazione (cosa conta di più)

| Cosa | Importanza |
|------|-----------|
| Hook che funzionano davvero | Alta |
| 4 skill con step concreti | Alta |
| Plugin installabile su macchina pulita | Alta |
| Step 1-6 registrazione funzionanti end-to-end | Alta |
| Backend register + login + users.json | Alta |
| Test frontend al 70% | Alta |
| La git history dimostra che il plugin era attivo | Alta |
| Presentazione live (15-20 min) | Alta |
| Agent con budget dichiarato | Media |
| Almeno 6 test sugli hook | Media |
| Commit history pulita e leggibile | Media |
| README che spiega il perché delle scelte | Media |
| Design coerente con SIAE+ | Media |

---

## Consigli pratici

- **Usa Claude Code per costruire il plugin stesso** — è il punto del gioco.
- Non cercare la perfezione: un hook che funziona vale più di 10 hook incompleti.
- Testa ogni 20 minuti riavviando la sessione Claude Code.
- Fai commit frequenti con il formato Conventional Commits — la git history è parte della valutazione.
- Se sei bloccato su un hook, passa a una skill o all'agent. Non restare fermo.
- Per verificare che il contesto sia iniettato, chiedi a Claude: *"Cosa sai di questo plugin?"*
