# Coordinamento Team — Hackathon SIAE 2026

> Leggi questo file PRIMA di iniziare. Poi leggi solo il file della tua persona.

---

## Chi fa cosa

| File | Persona | Responsabilità |
|------|---------|---------------|
| [persona1-backend-lead.md](persona1-backend-lead.md) | Persona 1 | Backend: login, JWT, middleware auth, `/api/me` |
| [persona2-backend-register-frontend-setup.md](persona2-backend-register-frontend-setup.md) | Persona 2 | Backend: register endpoint · Frontend: setup, store Pinia, router, apiService |
| [persona3-frontend-step1-4.md](persona3-frontend-step1-4.md) | Persona 3 | Frontend: useValidation, Step 1-4 (anagrafica, credenziali, contatti, foto) |
| [persona4-frontend-step5-8-dashboard.md](persona4-frontend-step5-8-dashboard.md) | Persona 4 | Frontend: Step 5-8, LoginView, DashboardView, UI/UX |

---

## Timeline visiva (8 ore totali — Story 1 già completata)

```
Ore  0         1         2         3         4
     |---------|---------|---------|---------|

P1   [Setup BE]--[Login+JWT]--[Auth MW /me]--[Test BE]-[Fix]

P2   [Setup BE]--[Setup FE ←CRITICO]--[Register]--[Store+Router]--[Test]
                   ↑↑ sblocca P3 e P4 entro ora 0:45

P3   [useValidation]---(attende P2)---[Step 1]--[Step 2]--[Step 3]--[Step 4]--[Test]

P4   [Step 5 logica]---(attende P2)---[Step 6]--[Step 7]--[Step 8]--[Login+Dashboard]--[Test]
```

---

## Dipendenze critiche

### P2 deve finire il setup frontend ENTRO 45 MINUTI

Il setup di Persona 2 sblocca Persona 3 e Persona 4. Prima che finisca, P3 scrive `useValidation.ts` e P4 scrive la logica di Step5 in un file isolato.

### Interfacce TypeScript condivise

Persona 1 definisce in `backend/src/types/user.ts`:
```typescript
export interface User { ... }
export interface RegisterPayload { ... }
```

Persona 2 copia queste in `frontend/src/types/api.ts` dopo averle ricevute.
Persona 3 e 4 importano solo da `@/types/api.ts`.

### Costante REPERTOIRES

Persona 4 crea `frontend/src/constants/repertoires.ts`.
Persona 3 non ne ha bisogno (i repertori iniziano allo step 5).

---

## Regole di coordinamento

### Git

- Lavorate su branch separati:
  - `feature/backend-auth` → P1
  - `feature/backend-register` e `feature/frontend-setup` → P2
  - `feature/frontend-steps-1-4` → P3
  - `feature/frontend-steps-5-8` → P4
- Fate PR verso `main` quando il vostro pezzo è completo e testato
- Nessun push diretto su `main`

### Convenzioni commit (obbligatorie — l'hook le valida)

```
feat(frontend): add step 1 - dati anagrafici
feat(backend): add login endpoint
test(frontend): add vitest coverage
chore(frontend): scaffold vite project
fix(backend): handle duplicate email on register
style(frontend): apply siae brand colors
```

### Porta del backend

Il backend gira su `http://localhost:3000`. Il proxy Vite è già configurato da P2:
- Chiamate del frontend verso `/api/*` vengono proxate automaticamente
- Non usate `http://localhost:3000` negli `apiService.ts`, usate solo `/api`

---

## Punti di sincronizzazione

### Sync 1 — Ora 0:45

P2 annuncia: "Setup frontend completato. Trovate i placeholder in `src/components/registration/`."
P3 e P4 fanno `git pull` e iniziano a riempire i loro componenti.

### Sync 2 — Ora 1:30

P1 annuncia: "Backend login funzionante. Endpoint: `POST /api/login` → `{ token }`."
P4 può iniziare a testare LoginView con il backend reale.

P2 annuncia: "Backend register funzionante. Endpoint: `POST /api/register` → 201/409."
P4 può testare Step6Riepilogo con il backend reale.

### Sync 3 — Ora 3:00

Integrazione generale: `git merge` di tutti i branch in `main`.
Tutti testano il flusso end-to-end: Register (step 1→8) → Login → Dashboard.

### Sync 4 — Ora 3:45

Fix integrazione e copertura test. Ognuno porta il proprio coverage a ≥70%.

---

## Checklist team — consegna

### Story 1 — Plugin (già completata, verificate)
- [ ] `bash siae-plugin/tests/test.sh` → tutti i test passano
- [ ] SessionStart hook inietta il contesto (riavviare Claude Code e chiedere "cosa sai di questo plugin?")
- [ ] PreToolUse hook blocca commit non validi
- [ ] Plugin installabile: `claude plugin add --path ./siae-plugin`

### Story 2 — SIAE+
- [ ] `npm run dev` (frontend) parte su localhost:5173
- [ ] `npm run dev` (backend) parte su localhost:3000
- [ ] Flusso completo: registrazione step 1→6 funziona end-to-end
- [ ] `POST /api/login` funziona, ritorna JWT
- [ ] `GET /api/users/me` con token valido ritorna dati utente
- [ ] `users.json` contiene l'utente con password hashata e foto base64
- [ ] `npm run test -- --coverage` (frontend) → ≥70% su branches/lines/functions/statements
- [ ] Design coerente con brand SIAE (colori, font, mobile responsive)
- [ ] Git history mostra commit frequenti con Conventional Commits

### Dimostrazione (15–20 min)
- [ ] Mostrate il plugin in azione: commit valido e invalido
- [ ] Mostrate il flusso di registrazione step by step nel browser
- [ ] Mostrate il login e la dashboard
- [ ] Mostrate `users.json` con i dati salvati
- [ ] Mostrate il report di coverage Vitest

---

## Problemi comuni e soluzioni rapide

### "Il frontend non si connette al backend"
→ Verificate che il proxy Vite sia configurato: in `vite.config.ts` dovete avere:
```ts
server: { proxy: { '/api': 'http://localhost:3000' } }
```

### "CORS error nel browser"
→ Verificate che il backend abbia `cors({ origin: 'http://localhost:5173' })`

### "Il token JWT non funziona"
→ Verificate che `JWT_SECRET` sia definito in `.env` e che `dotenv` sia caricato all'inizio di `index.ts`

### "users.json non viene creato"
→ Verificate che la cartella `backend/data/` esista. Createla con `mkdir -p backend/data && echo '[]' > backend/data/users.json`

### "La coverage è sotto il 70%"
→ Aggiungete test per i casi limite (valore vuoto, valore invalido, valore al limite). I branch non coperti sono spesso i casi `else` e i guard `if (!value)`.

### "Il commit viene bloccato dall'hook"
→ Il formato è `tipo(scope): descrizione`. Tipi validi: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert. Esempio: `feat(frontend): add step 3`
