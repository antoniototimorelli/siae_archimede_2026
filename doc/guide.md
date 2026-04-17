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
