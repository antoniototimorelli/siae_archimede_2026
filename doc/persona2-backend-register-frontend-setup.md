# Persona 2 — Backend Register + Frontend Architecture

> **Ruolo**: sei il collante del team. Fai due cose critiche in parallelo: l'endpoint di registrazione backend e lo scheletro frontend che sblocca Persona 3 e 4.
>
> **ATTENZIONE**: il setup frontend è la dipendenza bloccante per tutto il team. Fallo **prima**, entro i primi 45 minuti.
>
> **Stack**: Express · TypeScript · Vue 3 · Pinia · Vue Router · Vite · Vitest

---

## Ordine di esecuzione — critico

```
0:00 → 0:45   Setup frontend (sblocca P3 e P4)
0:45 → 1:30   Endpoint /api/register (backend)
1:30 → 2:30   Store Pinia + Router + componenti base
2:30 → 3:30   Test frontend
3:30 → 4:00   Integrazione e fix
```

---

## Fase 1 — Setup Frontend (45 min — PRIORITÀ ASSOLUTA)

Questo sblocca Persona 3 e Persona 4. Non procedere ad altro finché questo non funziona.

### Struttura da creare

```
frontend/
├── src/
│   ├── components/
│   │   └── registration/        ← P3 e P4 lavoreranno qui
│   ├── views/
│   │   ├── LoginView.vue        ← P4 la implementa
│   │   ├── RegisterView.vue     ← tu la implementi (container degli step)
│   │   └── DashboardView.vue    ← P4 la implementa
│   ├── stores/
│   │   ├── registrationStore.ts ← TUO
│   │   └── authStore.ts         ← TUO
│   ├── composables/
│   │   └── useValidation.ts     ← P3 la implementa (cartella già presente)
│   ├── services/
│   │   └── apiService.ts        ← TUO
│   ├── types/
│   │   └── api.ts               ← copia da backend/src/types/user.ts
│   ├── router/
│   │   └── index.ts             ← TUO
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

### Prompt da copiare in Claude Code

```
Crea il progetto frontend Vue 3 + TypeScript per l'app SIAE+ nella cartella /frontend.

Usa Vite come bundler. Esegui:
  npm create vite@latest frontend -- --template vue-ts
poi entra nella cartella e installa:
  npm install vue-router@4 pinia @vueuse/core
  npm install -D vitest @vitejs/plugin-vue jsdom @vitest/coverage-v8 @vue/test-utils

Configura Capacitor (RNF-01):
  npm install @capacitor/core @capacitor/cli
  npx cap init "SIAE+" "com.siae.plus" --web-dir dist

Installa il design system dal tarball locale (nella root del repo):
  npm install ../../itsiae-siae-design-system-1.0.3.tgz

Configura main.ts:
  import { createApp } from 'vue'
  import { createPinia } from 'pinia'
  import router from './router'
  import '@itsiae/siae-design-system/dist/siae-design-system.css'
  import * as SiaeDS from '@itsiae/siae-design-system'
  import App from './App.vue'

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  Object.entries(SiaeDS).forEach(([name, component]) => {
    if (name.startsWith('Siae')) app.component(name, component as any)
  })
  app.mount('#app')

Configura vite.config.ts:
  - alias @/ → src/
  - server proxy: /api → http://localhost:3000

Configura vitest.config.ts:
  - environment: jsdom
  - coverage: provider v8, thresholds 70% per branches/lines/functions/statements
  - globals: true

Crea il router src/router/index.ts con queste route:
  / → redirect a /login
  /login → LoginView.vue
  /register → RegisterView.vue
  /dashboard → DashboardView.vue (protetta: redirect /login se non autenticato)

Crea src/types/api.ts con queste interfacce:
  export interface User {
    id: string; firstName: string; lastName: string; fiscalCode: string
    email: string; phone: string; address: string; repertoires: string[]
    photo?: string; birthDate: string; createdAt: string
  }
  export interface LoginResponse { token: string }
  export interface ApiError { error: string }

Crea placeholder vuoti per:
  - src/views/LoginView.vue (solo <template><div>Login</div></template>)
  - src/views/RegisterView.vue (solo <template><div>Register</div></template>)
  - src/views/DashboardView.vue (solo <template><div>Dashboard</div></template>)
  - src/components/registration/ (cartella vuota con .gitkeep)
  - src/composables/useValidation.ts (file vuoto con export {})

Verifica che "npm run dev" parta senza errori su localhost:5173.

Fai il commit con "chore(frontend): scaffold vue3 typescript vite project".
```

---

## Fase 2 — Store Pinia (30 min)

### registrationStore.ts

Questo store è il cervello del flusso multi-step. Persona 3 e 4 lo useranno per salvare i dati di ogni step.

### Prompt da copiare in Claude Code

```
Crea src/stores/registrationStore.ts nel frontend SIAE+.

Questo store Pinia gestisce tutto il flusso di registrazione in 8 step.

Interfaccia RegistrationData (tutti i campi di tutti gli step):
  firstName: string        // Step 1
  lastName: string         // Step 1
  fiscalCode: string       // Step 1
  email: string            // Step 2
  password: string         // Step 2
  confirmPassword: string  // Step 2
  phone: string            // Step 3
  address: string          // Step 3
  photo: string            // Step 4 (base64, stringa vuota se non caricata)
  repertoires: string[]    // Step 5
  birthDate: string        // calcolato da fiscalCode o inserito separatamente
  paymentAccepted: boolean // Step 7

Lo store deve esporre:
- currentStep: ref<number> (inizia a 1)
- data: reactive<RegistrationData> (tutto inizializzato a valori vuoti)
- totalSteps: computed (8)
- progressPercentage: computed ((currentStep / totalSteps) * 100)

Azioni:
- goToStep(step: number): imposta currentStep (clamp tra 1 e 8)
- nextStep(): currentStep++ se currentStep < 8
- prevStep(): currentStep-- se currentStep > 1
- updateData(partial: Partial<RegistrationData>): aggiorna i campi nel data
- resetRegistration(): riporta tutto ai valori iniziali
- isUnder30(): boolean — calcola l'età da data.fiscalCode
  (i caratteri 6-7 del CF italiano sono l'anno di nascita: 00-99)
  Se anno ≤ 25 → 2000+anno, altrimenti 1900+anno
  Confronta con l'anno corrente

Crea src/stores/authStore.ts:
- token: ref<string | null> (inizia null — salvato solo in memoria, MAI in localStorage — RNF-04)
- isAuthenticated: computed (token !== null)
- setToken(t: string): token.value = t
- logout(): token.value = null; router.push('/login')
- getAuthHeader(): { Authorization: string } | {} — ritorna l'header per le fetch

Fai il commit con "feat(frontend): add registration and auth pinia stores".
```

---

## Fase 3 — API Service (20 min)

### Prompt da copiare in Claude Code

```
Crea src/services/apiService.ts nel frontend SIAE+.

Questo servizio centralizza tutte le chiamate HTTP al backend (http://localhost:3000).
Usa il proxy Vite configurato in vite.config.ts (chiamate verso /api vengono proxate).

Deve esportare queste funzioni tipizzate (no any):

import type { User, LoginResponse } from '@/types/api'
import { useAuthStore } from '@/stores/authStore'

// POST /api/login
export async function login(email: string, password: string): Promise<LoginResponse>
// Lancia Error con il messaggio dell'API in caso di 4xx/5xx

// POST /api/register
export async function register(payload: RegisterPayload): Promise<{ message: string }>
// RegisterPayload deve includere tutti i campi di RegistrationData (senza confirmPassword e paymentAccepted)
// Lancia Error con il messaggio in caso di 409 (utente già esistente) o altri errori

// GET /api/users/me (richiede token)
export async function getMe(): Promise<User>
// Usa authStore.getAuthHeader() per aggiungere Authorization header
// Lancia Error con 401 se token scaduto

// GET /api/health
export async function healthCheck(): Promise<boolean>

Helper interno:
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T>
- Aggiunge Content-Type: application/json
- Lancia un Error con il campo error dalla risposta JSON in caso di status >= 400

Fai il commit con "feat(frontend): add api service with typed fetch functions".
```

---

## Fase 4 — Componente RegisterView (contenitore step) (30 min)

`RegisterView.vue` è il componente padre che contiene il progresso e monta dinamicamente ogni step.

### Prompt da copiare in Claude Code

```
Crea src/views/RegisterView.vue nel frontend SIAE+.

Questo componente è il contenitore del flusso multi-step. Non implementa la logica
di ogni step (quella è nei componenti in src/components/registration/), ma gestisce:

1. Mostra un ProgressStepper: barra di avanzamento o indicatore 1/8, 2/8, ecc.
   Usa registrationStore.currentStep e registrationStore.totalSteps.

2. Monta dinamicamente il componente del step corrente con <component :is="currentStepComponent">.
   Mapping step → componente (usa defineAsyncComponent per lazy loading):
   1 → Step1Anagrafica
   2 → Step2Credenziali
   3 → Step3Contatti
   4 → Step4Foto
   5 → Step5Repertorio
   6 → Step6Riepilogo
   7 → Step7Pagamento
   8 → Step8Conferma

3. Usa <Suspense> con fallback "Caricamento..." per i componenti lazy.

4. Crea anche il componente src/components/ProgressStepper.vue:
   Props: currentStep (number), totalSteps (number)
   Mostra: una barra di avanzamento (usa il componente del design system se disponibile)
   oppure una lista di N cerchi con quello corrente evidenziato.

5. Per i componenti di step non ancora creati, crea placeholder in
   src/components/registration/:
   Step1Anagrafica.vue, Step2Credenziali.vue, Step3Contatti.vue, Step4Foto.vue,
   Step5Repertorio.vue, Step6Riepilogo.vue, Step7Pagamento.vue, Step8Conferma.vue
   Ogni placeholder: <template><div>Step N — in costruzione</div></template>
   Persona 3 riempirà Step1-4, Persona 4 riempirà Step5-8.

6. In App.vue: solo <RouterView /> (niente layout complesso per ora).

Fai il commit con "feat(frontend): add register view container with stepper".
```

---

## Fase 5 — Endpoint /api/register nel backend (40 min)

Ora che il frontend è in piedi, torna al backend per implementare la registrazione.

### Prompt da copiare in Claude Code

```
Implementa l'endpoint POST /api/register nel backend SIAE+.

Coordinati con Persona 1: il file src/types/user.ts e src/services/user.service.ts
sono condivisi. Usa git pull prima di iniziare.

src/services/user.service.ts deve esportare:
- readUsers(): User[] — legge data/users.json con fs.readFileSync, JSON.parse, ritorna array
- writeUsers(users: User[]): void — scrive con fs.writeFileSync, JSON.stringify con indentazione 2
- findByEmail(email: string): User | undefined
- findByFiscalCode(fiscalCode: string): User | undefined
- createUser(payload: RegisterPayload): User
  - Genera id con crypto.randomUUID()
  - Hash password con bcrypt.hashSync(password, 10)
  - Aggiunge createdAt: new Date().toISOString()
  - Salva con writeUsers
  - Ritorna l'utente creato (senza passwordHash — usa Omit<User, 'passwordHash'>)
  Attenzione: non ritornare MAI la passwordHash al chiamante

src/controllers/register.controller.ts:
- register(req: Request, res: Response): Promise<void>
  Input body: RegisterPayload (firstName, lastName, fiscalCode, email, password, phone, address, repertoires, photo?, birthDate)
  
  Validazione (risponde 400 se fallisce):
  - Verifica che firstName, lastName, fiscalCode, email, password, phone, address, repertoires siano presenti e non vuoti
  - Verifica che repertoires sia un array non vuoto
  
  Controllo duplicati (risponde 409 se trovati):
  - findByEmail(email) → se trovato: { error: "Email già registrata. Accedi con le tue credenziali." }
  - findByFiscalCode(fiscalCode) → se trovato: { error: "Codice fiscale già registrato. Accedi con le tue credenziali." }
  
  Salvataggio:
  - createUser(payload)
  - Risponde 201 con { message: "Registrazione completata con successo", userId: user.id }
  
  Commenta l'endpoint:
  // POST /api/register | body: RegisterPayload | res: 201 { message, userId } | 400 | 409

src/routes/register.routes.ts:
- POST /register → register.controller.register

Monta su /api in index.ts.

Fai il commit con "feat(backend): add register endpoint with duplicate check".
```

---

## Fase 6 — Test del registrationStore (30 min)

### Prompt da copiare in Claude Code

```
Scrivi i test Vitest per src/stores/registrationStore.ts e src/stores/authStore.ts.

File: src/stores/__tests__/registrationStore.test.ts

Testa:
1. currentStep inizia a 1
2. nextStep() incrementa currentStep
3. prevStep() non va sotto 1
4. goToStep(3) imposta currentStep a 3
5. updateData({ firstName: 'Mario' }) aggiorna solo il campo firstName
6. resetRegistration() riporta tutto ai valori iniziali
7. totalSteps è 8
8. progressPercentage al step 4 è 50%
9. isUnder30() con CF di una persona nata nel 2000 ritorna true
10. isUnder30() con CF di una persona nata nel 1985 ritorna false

File: src/stores/__tests__/authStore.test.ts

Testa:
1. isAuthenticated è false all'avvio
2. setToken('abc') imposta il token
3. isAuthenticated è true dopo setToken
4. logout() imposta token a null
5. getAuthHeader() ritorna {} se non autenticato
6. getAuthHeader() ritorna { Authorization: 'Bearer abc' } se autenticato

Usa setActivePinia(createPinia()) in beforeEach per resettare lo store.

Poi esegui "npm run test -- --coverage" dalla cartella frontend e mostrami il report.

Fai il commit con "test(frontend): add pinia store unit tests".
```

---

## Dipendenze verso gli altri

### Cosa devi dare a Persona 3 (appena hai finito Fase 1 + 2)

```
Setup frontend completato. Ecco cosa ti serve:

STORE: src/stores/registrationStore.ts
  - useRegistrationStore()
  - data: RegistrationData (tutti i campi)
  - currentStep: number
  - nextStep(), prevStep(), goToStep(n)
  - updateData(partial)

ROUTE: /register → RegisterView.vue (già presente)
  Il tuo componente viene montato automaticamente
  quando registrationStore.currentStep corrisponde al tuo step.

COMPONENTI PLACEHOLDER già creati in src/components/registration/:
  Step1Anagrafica.vue (step 1 → il tuo)
  Step2Credenziali.vue (step 2 → il tuo)
  Step3Contatti.vue (step 3 → il tuo)
  Step4Foto.vue (step 4 → il tuo)

Per avanzare al prossimo step: chiama registrationStore.nextStep()
Per salvare dati: chiama registrationStore.updateData({ campo: valore })
```

### Cosa devi dare a Persona 4 (appena hai finito Fase 1 + 2)

Stesse informazioni di P3, ma per Step5-8, DashboardView e LoginView.

### Dipendenze da Persona 1

- Interfacce TypeScript in `src/types/user.ts` del backend → copiare in `frontend/src/types/api.ts`
- Endpoint `/api/login` e `/api/users/me` funzionanti per i test di integrazione

---

## Commit da fare (in ordine)

```bash
chore(frontend): scaffold vue3 typescript vite project
feat(frontend): add registration and auth pinia stores
feat(frontend): add api service with typed fetch functions
feat(frontend): add register view container with stepper
feat(backend): add register endpoint with duplicate check
test(frontend): add pinia store unit tests
```

---

## Checklist finale

- [ ] `npm run dev` parte senza errori sul frontend (porta 5173)
- [ ] `npm run dev` parte senza errori sul backend (porta 3000)
- [ ] Proxy Vite: `/api/*` proxato a `localhost:3000`
- [ ] `POST /api/register` con dati validi risponde 201
- [ ] `POST /api/register` con email duplicata risponde 409
- [ ] `POST /api/register` con body mancante risponde 400
- [ ] `users.json` contiene l'utente salvato (con password hashata, foto in base64)
- [ ] Store `registrationStore`: cambio step, salvataggio dati, reset funzionano
- [ ] Store `authStore`: token in memoria (non localStorage)
- [ ] Router con le 4 route: /, /login, /register, /dashboard
- [ ] Componenti placeholder per tutti gli 8 step presenti
- [ ] Capacitor configurato
- [ ] Design system importato in `main.ts`
- [ ] Test store passano con >70% coverage
