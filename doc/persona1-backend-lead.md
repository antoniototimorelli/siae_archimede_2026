# Persona 1 — Backend Lead: Autenticazione + Sicurezza

> **Ruolo**: sei il responsabile del backend di autenticazione. Il tuo lavoro sblocca tutto il team — appena login e JWT funzionano, il frontend può fare chiamate reali.
>
> **Stack**: Node.js 18+ · Express · TypeScript · bcrypt · jsonwebtoken · fs nativo

---

## Priorità assoluta — Prima ora

Devi completare il **setup del backend** e l'**endpoint `/api/login`** entro la prima ora. Persona 3 e 4 ne hanno bisogno per testare il flusso completo. Coordina con Persona 2 per non duplicare il setup.

**Divisione con Persona 2:**
- Tu fai: `/backend` scaffolding + login + JWT + middleware auth
- Persona 2 fa: endpoint `/api/register` + lettura/scrittura `users.json`

---

## Fase 1 — Setup backend (30 min)

### File da creare

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts       ← login
│   │   └── user.routes.ts       ← /api/me (protetta)
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── services/
│   │   ├── auth.service.ts      ← verifica credenziali, genera JWT
│   │   └── user.service.ts      ← legge users.json (condiviso con P2)
│   ├── middleware/
│   │   └── auth.middleware.ts   ← verifica Bearer token
│   ├── types/
│   │   └── user.ts              ← interfacce TypeScript condivise
│   └── index.ts                 ← entry point Express
├── data/
│   └── users.json               ← file di persistenza (array vuoto [])
├── .env                         ← JWT_SECRET=cambia_questa_chiave PORT=3000
├── .env.example                 ← JWT_SECRET=your_secret_here PORT=3000
├── .gitignore                   ← node_modules, .env, dist
├── tsconfig.json
└── package.json
```

### Prompt da copiare in Claude Code

```
Crea il backend Express + TypeScript per l'app SIAE+ nella cartella /backend.

Struttura richiesta:
- src/routes/ (auth.routes.ts, user.routes.ts)
- src/controllers/ (auth.controller.ts, user.controller.ts)
- src/services/ (auth.service.ts, user.service.ts)
- src/middleware/auth.middleware.ts
- src/types/user.ts
- src/index.ts (entry point)
- data/users.json (array JSON vuoto [])
- .env con JWT_SECRET=cambia_questa_chiave e PORT=3000
- .env.example con valori placeholder
- .gitignore che esclude node_modules, .env, dist
- tsconfig.json con strict: true, target: ES2020, module: CommonJS
- package.json con script: dev (ts-node-dev --respawn src/index.ts), build (tsc), start (node dist/index.js)

Dipendenze da installare: express, jsonwebtoken, bcrypt, cors, dotenv
Dev dipendenze: typescript, ts-node-dev, @types/express, @types/node, @types/jsonwebtoken, @types/bcrypt, @types/cors

In src/types/user.ts definisci queste interfacce TypeScript (saranno usate da tutto il team):

export interface User {
  id: string
  firstName: string
  lastName: string
  fiscalCode: string
  email: string
  passwordHash: string
  phone: string
  address: string
  repertoires: string[]
  photo?: string       // base64
  birthDate: string    // formato ISO YYYY-MM-DD
  createdAt: string
}

export interface UserCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  fiscalCode: string
  email: string
  password: string
  phone: string
  address: string
  repertoires: string[]
  photo?: string
  birthDate: string
}

In src/index.ts:
- Carica dotenv all'inizio
- Configura CORS per permettere chiamate da localhost:5173 (Vite default)
- Usa express.json() come middleware
- Monta le route su /api/auth e /api/users
- Avvia su PORT da .env

Fai il commit con "chore(backend): scaffold express typescript project".
```

---

## Fase 2 — Servizio autenticazione (30 min)

### Cosa implementare

**`src/services/auth.service.ts`**
- `verifyCredentials(email, password)`: legge `users.json`, trova utente per email, confronta password con bcrypt — ritorna `User | null`
- `generateToken(userId, email)`: genera JWT firmato con `JWT_SECRET`, payload `{ userId, email }`, scadenza `1h` — ritorna `string`
- `verifyToken(token)`: verifica e decode JWT — ritorna payload o lancia eccezione

**`src/controllers/auth.controller.ts`**
- `login(req, res)`: chiama `verifyCredentials`, se null risponde 401 con messaggio generico, se ok chiama `generateToken` e risponde 200 con `{ token }`

**`src/routes/auth.routes.ts`**
- `POST /api/login` → `auth.controller.login`

### Prompt da copiare in Claude Code

```
Implementa il sistema di autenticazione nel backend SIAE+.

src/services/auth.service.ts deve esportare:
1. verifyCredentials(email: string, password: string): Promise<User | null>
   - Legge data/users.json con fs.readFileSync (sincrono va bene)
   - Trova l'utente per email (case insensitive)
   - Confronta la password con bcrypt.compare
   - Ritorna l'utente se le credenziali sono corrette, null altrimenti
   - TypeScript tipizzato, no any

2. generateToken(userId: string, email: string): string
   - Genera JWT con jsonwebtoken.sign
   - Payload: { userId, email }
   - Firma con process.env.JWT_SECRET (lancia errore se non definito)
   - Scadenza: 1h
   - Ritorna la stringa del token

3. verifyToken(token: string): { userId: string; email: string }
   - Verifica con jsonwebtoken.verify
   - Lancia JsonWebTokenError se non valido

src/controllers/auth.controller.ts deve esportare:
- login(req: Request, res: Response): Promise<void>
  - Valida che body contenga email e password, altrimenti 400
  - Chiama verifyCredentials
  - Se null: risponde 401 con { error: "Credenziali non valide" } (mai specificare quale campo è sbagliato — RF-03)
  - Se ok: risponde 200 con { token }
  - Commenta l'endpoint: // POST /api/login | body: { email, password } | res: 200 { token } | 401 { error }

src/routes/auth.routes.ts:
- Router Express con POST /login che chiama auth.controller.login

In src/index.ts monta questo router su /api/auth.

Fai il commit con "feat(backend): add login endpoint with JWT authentication".
```

---

## Fase 3 — Middleware JWT + endpoint /api/me (20 min)

### Cosa implementare

**`src/middleware/auth.middleware.ts`**
- Legge header `Authorization: Bearer <token>`
- Verifica il token con `auth.service.verifyToken`
- Se invalido/assente → risponde 401
- Se valido → aggiunge `req.user = { userId, email }` e chiama `next()`

**`src/controllers/user.controller.ts`**
- `getMe(req, res)`: usa `req.user.userId` per trovare l'utente in `users.json`, risponde 200 con i dati (senza `passwordHash`)

**`src/routes/user.routes.ts`**
- `GET /api/users/me` → `authMiddleware` + `user.controller.getMe`

### Prompt da copiare in Claude Code

```
Implementa il middleware di autenticazione e l'endpoint /api/me nel backend SIAE+.

src/middleware/auth.middleware.ts:
- Estende Express.Request per aggiungere il campo user: { userId: string; email: string }
  (usa declaration merging: declare global { namespace Express { interface Request { user?: ... } } })
- Legge Authorization header, estrae Bearer token
- Se header assente o malformato: risponde 401 { error: "Token mancante" }
- Chiama auth.service.verifyToken — se lancia eccezione: risponde 401 { error: "Token non valido" }
- Se ok: imposta req.user e chiama next()

src/controllers/user.controller.ts:
- getMe(req: Request, res: Response): legge users.json, trova l'utente per req.user.userId
  Risponde 200 con l'utente SENZA passwordHash (usa destructuring per escluderlo)
  Commenta: // GET /api/users/me | header: Authorization Bearer | res: 200 User (senza passwordHash) | 401

src/routes/user.routes.ts:
- GET /me → authMiddleware → user.controller.getMe

Monta su /api/users in index.ts.

Fai il commit con "feat(backend): add auth middleware and /api/me endpoint".
```

---

## Fase 4 — CORS e configurazione per il frontend (10 min)

Verifica che il backend risponda correttamente alle chiamate del frontend Vue (porta 5173).

### Prompt da copiare in Claude Code

```
Verifica la configurazione CORS del backend SIAE+.

In src/index.ts assicurati che cors sia configurato così:
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

Poi avvia il backend con "npm run dev" e verifica che:
1. Il server parta sulla porta 3000 senza errori
2. GET http://localhost:3000/api/health (aggiungi questo endpoint di health check) risponda 200 { status: 'ok' }

Aggiungi il GET /api/health come route veloce in index.ts:
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

Fai il commit con "chore(backend): add health check and verify cors config".
```

---

## Fase 5 — Test del backend (40 min)

Il tracciato non richiede test backend con framework formale, ma almeno verifica manuale con curl o uno script.

### Prompt da copiare in Claude Code

```
Scrivi uno script bash backend/test-manual.sh che testa gli endpoint del backend manualmente con curl.

Lo script deve testare:
1. POST /api/login con credenziali valide (prima crea un utente di test in users.json)
2. POST /api/login con email inesistente → deve dare 401
3. POST /api/login con password sbagliata → deve dare 401
4. GET /api/users/me senza token → deve dare 401
5. GET /api/users/me con token valido → deve dare 200 con dati utente
6. GET /api/health → deve dare 200

Per ogni test: stampa PASS o FAIL con il codice HTTP ricevuto.

Nota: per il test 1 serve un utente in data/users.json. Crea anche uno script
backend/seed.ts che inserisce un utente di test (password: Test1234!) e
aggiunge uno script "seed" in package.json: "ts-node src/seed.ts".

Fai il commit con "test(backend): add manual test script and seed".
```

---

## Dipendenze verso gli altri

| Chi | Cosa ti serve da loro | Quando |
|-----|-----------------------|--------|
| Persona 2 | `user.service.ts` con `findByEmail` e `readUsers` | Entro ora 1.5 — altrimenti la implementi tu provisoriamente |
| Persona 2 | Struttura definitiva di `User` in `types/user.ts` | Prima di scrivere authService |
| Persona 3/4 | Niente — loro dipendono da te | — |

### Cosa devi dare agli altri

Appena hai il backend pronto, comunica a Persona 2, 3, 4:

```
Backend pronto su http://localhost:3000

Endpoint disponibili:
POST /api/login         body: { email, password }      res: { token }
GET  /api/users/me      header: Authorization Bearer   res: User
GET  /api/health                                        res: { status: 'ok' }

Interfaccia User (src/types/user.ts) — usatela nel frontend copiando il file in frontend/src/types/api.ts
```

---

## Punti bonus (se finisci prima)

### Validazione backend (RNF-03)

```
Aggiungi validazione minima nel controller register (coordinati con Persona 2
che lo implementa, oppure fallo tu se hanno già finito):
- Tutti i campi obbligatori presenti (400 se mancano)
- Email ha formato valido (regex)
- FiscalCode ha lunghezza 16
- Password rispetta il pattern (min 8, 1 maiuscola, 1 numero)
Usa una funzione validateRegisterPayload(body) che ritorna { valid: boolean, errors: string[] }.
```

### Sicurezza extra

```
Aggiungi rate limiting all'endpoint /api/login per prevenire brute force:
installa express-rate-limit, limita a 10 tentativi per IP ogni 15 minuti,
risponde 429 Too Many Requests se superato.
Fai il commit con "feat(backend): add rate limiting to login endpoint".
```

---

## Commit da fare (in ordine)

```bash
chore(backend): scaffold express typescript project
feat(backend): add login endpoint with JWT authentication
feat(backend): add auth middleware and /api/me endpoint
chore(backend): add health check and verify cors config
test(backend): add manual test script and seed
```

---

## Checklist finale

- [ ] `npm run dev` parte senza errori
- [ ] `POST /api/login` con credenziali valide risponde `{ token }`
- [ ] `POST /api/login` con credenziali errate risponde 401 (messaggio generico)
- [ ] `GET /api/users/me` senza token risponde 401
- [ ] `GET /api/users/me` con token valido risponde dati utente (senza passwordHash)
- [ ] JWT firmato con `JWT_SECRET` da `.env`, scadenza 1h
- [ ] Password salvata come hash bcrypt (mai in chiaro)
- [ ] TypeScript strict, nessun `any` non giustificato
- [ ] Ogni endpoint commentato con input/output attesi (RNF-06)
