# Persona 4 — Frontend Steps 5–8 + Dashboard + UI/UX

> **Ruolo**: sei responsabile del completamento del flusso di registrazione (step 5-8), della schermata di login, della dashboard post-login e della coerenza visiva con il brand SIAE+.
>
> **Prerequisito**: aspetta che Persona 2 completi il setup frontend (~45 min). Nel frattempo scrivi i componenti stub degli step 5-8 in file separati e prepara la struttura dei test.
>
> **Stack**: Vue 3 Composition API · TypeScript · Pinia · Vitest · SIAE Design System

---

## Ordine di esecuzione

```
0:00 → 0:45   Step 5 — Scelta repertorio (non dipende dal setup P2, è logica pura)
0:45 → 1:15   Setup ricevuto da P2 → integra i componenti nel progetto
1:15 → 1:45   Step 6 — Riepilogo e conferma
1:45 → 2:15   Step 7 — Pagamento
2:15 → 2:45   Step 8 — Conferma finale
2:45 → 3:15   Login View + Dashboard View
3:15 → 4:00   Test Vitest + UI polish
```

---

## Fase 0 — Prima che P2 finisca: logica Step 5 (45 min)

Puoi scrivere la logica di selezione repertori in un file TypeScript puro, poi incollarlo nel componente Vue.

### Repertori SIAE da implementare

| ID | Nome | Icona suggerita |
|----|------|-----------------|
| `musica` | Musica | nota musicale |
| `cinema` | Cinema | ciak |
| `dor` | DOR (Dramma e Opere Radiotelevisive) | maschere teatro |
| `lirica` | Lirica | microfono |
| `opere_letterarie` | Opere Letterarie (OLAF) | libro |
| `arti_figurative` | Arti Figurative (OLAF) | pennello |

### Prompt da copiare in Claude Code (Fase 0 — standalone)

```
Crea il file frontend/src/components/registration/Step5Repertorio.vue per SIAE+.
(Anche se il progetto Vue non è ancora configurato, crea solo il file .vue — lo integreremo dopo)

Logica di selezione:
- selectedRepertoires: ref<string[]>([]) — array degli ID selezionati
  Inizializzato da registrationStore.data.repertoires se già presenti
- isValid: computed(() => selectedRepertoires.value.length > 0) — almeno uno obbligatorio

Repertori disponibili (definisci come costante nel file):
const REPERTOIRES = [
  { id: 'musica', label: 'Musica', emoji: '🎵' },
  { id: 'cinema', label: 'Cinema', emoji: '🎬' },
  { id: 'dor', label: 'DOR', description: 'Dramma e Opere Radiotelevisive', emoji: '🎭' },
  { id: 'lirica', label: 'Lirica', emoji: '🎤' },
  { id: 'opere_letterarie', label: 'Opere Letterarie', description: 'OLAF', emoji: '📚' },
  { id: 'arti_figurative', label: 'Arti Figurative', description: 'OLAF', emoji: '🎨' },
]

Funzione toggleRepertoire(id: string):
- Se già selezionato: rimuovilo dall'array
- Se non selezionato: aggiungilo all'array

Template:
- Titolo "Scegli i tuoi repertori"
- Testo: "Seleziona uno o più repertori per i quali vuoi essere tutelato da SIAE"
- Griglia di 2 o 3 colonne con una card per ogni repertorio
- Ogni card: emoji + nome + descrizione (se presente)
- Card selezionata: bordo colorato o sfondo evidenziato (usa classi Tailwind)
- Avviso sotto la griglia se nessun repertorio selezionato: "Seleziona almeno un repertorio"
- Pulsanti "Indietro" e "Avanti" (Avanti disabilitato se !isValid)

handleNext():
- registrationStore.updateData({ repertoires: selectedRepertoires.value })
- registrationStore.nextStep()

Fai il commit con "feat(frontend): add step 5 - scelta repertorio".
```

---

## Fase 1 — Step 6: Riepilogo e conferma (30 min)

Questo step mostra tutti i dati inseriti in sola lettura e invia al backend.

### Prompt da copiare in Claude Code

```
Implementa frontend/src/components/registration/Step6Riepilogo.vue per SIAE+.

Questo step legge i dati dal registrationStore e li mostra in sola lettura.

State:
- isLoading: ref<boolean>(false) — durante la chiamata API
- errorMessage: ref<string>('') — messaggio errore se la registrazione fallisce

Template — sezioni di riepilogo:
1. Sezione "Dati anagrafici": mostra firstName, lastName, fiscalCode
2. Sezione "Credenziali": mostra email, la password come ●●●●●●●● (mai in chiaro)
3. Sezione "Contatti": mostra phone, address
4. Sezione "Foto": se photo è presente mostra thumbnail (img con src=base64), altrimenti "Non caricata"
5. Sezione "Repertori": mostra lista dei repertori selezionati (nomi, non ID)

Per ogni sezione: pulsante "Modifica" che chiama registrationStore.goToStep(N)
dove N è il numero dello step corrispondente.

Pulsante "Conferma registrazione":
- Mostra spinner se isLoading
- Disabilitato durante il caricamento

handleConfirm():
- isLoading.value = true
- Costruisce il payload da registrationStore.data (no confirmPassword, no paymentAccepted)
- Chiama apiService.register(payload)
- Se successo: registrationStore.nextStep() (va allo step 7 o 8)
- Se errore 409 "utente già esistente": mostra messaggio con link "Vai al login"
- Se altro errore: mostra errorMessage
- isLoading.value = false in finally

Nota per il payload birthDate:
- Estrai dal codice fiscale: caratteri 6-7 (anno), 8 (mese codificato), 9-10 (giorno)
- Oppure usa direttamente registrationStore.data.birthDate se disponibile
- Se non disponibile, ometti il campo (il backend lo gestirà)

Fai il commit con "feat(frontend): add step 6 - riepilogo e conferma registrazione".
```

---

## Fase 2 — Step 7: Pagamento (30 min)

### Logica under/over 30

Usa il metodo `registrationStore.isUnder30()` che Persona 2 ha implementato nel store.

### Prompt da copiare in Claude Code

```
Implementa frontend/src/components/registration/Step7Pagamento.vue per SIAE+.

Questo step verifica l'età e mostra messaggi diversi.

Usa registrationStore.isUnder30() per determinare il flusso.

Caso under 30 (isUnder30() === true):
- Mostra un banner: "Ottima notizia! Hai meno di 30 anni: l'iscrizione a SIAE è gratuita per te."
- Un solo pulsante: "Continua" → nextStep()
- Nessun checkbox da accettare

Caso over/equal 30 (isUnder30() === false):
- Mostra avviso: "L'iscrizione a SIAE prevede il pagamento di una quota associativa.
  L'importo esatto ti verrà comunicato entro 30 giorni dall'iscrizione."
- Checkbox obbligatoria: "Ho letto e accetto le condizioni di pagamento"
  - paymentAccepted: ref<boolean>(false)
  - isValid: computed(() => paymentAccepted.value)
- Pulsante "Continua" disabilitato se !isValid

handleNext():
- registrationStore.updateData({ paymentAccepted: paymentAccepted.value })
- registrationStore.nextStep()

Template:
- Titolo "Quota associativa"
- Contenuto condizionale basato su isUnder30()
- Pulsanti "Indietro" e "Continua"

Fai il commit con "feat(frontend): add step 7 - pagamento with age check".
```

---

## Fase 3 — Step 8: Conferma finale (20 min)

### Prompt da copiare in Claude Code

```
Implementa frontend/src/components/registration/Step8Conferma.vue per SIAE+.

Questo è l'ultimo step, mostrato dopo la registrazione completata.

Nota: la registrazione vera viene inviata al backend nello Step 6.
Questo step mostra solo il risultato. Leggi l'esito da registrationStore
(aggiungi un campo registrationStatus: 'idle' | 'success' | 'error' | string nello store se non esiste).

Caso successo:
- Icona ✓ verde (grande)
- Titolo: "Registrazione completata!"
- Testo: "Il tuo account SIAE è stato creato. Puoi ora accedere con le tue credenziali."
- Pulsante "Vai al login" → router.push('/login')

Caso errore (se registrationStore ha un errorMessage):
- Icona ✗ rossa
- Titolo: "Si è verificato un errore"
- Testo: mostra il messaggio di errore
- Pulsante "Riprova" → registrationStore.goToStep(6)
- Pulsante "Torna all'inizio" → registrationStore.resetRegistration() + router.push('/register')

Il componente legge lo stato dal store, non gestisce direttamente la chiamata API.

Aggiorna registrationStore per aggiungere:
- registrationStatus: ref<'idle' | 'success' | 'error'>('idle')
- registrationError: ref<string>('')
- setRegistrationResult(status: 'success' | 'error', error?: string): void

Step6Riepilogo deve chiamare:
  registrationStore.setRegistrationResult('success') dopo successo API
  registrationStore.setRegistrationResult('error', errore) dopo fallimento

Fai il commit con "feat(frontend): add step 8 - conferma registrazione".
```

---

## Fase 4 — Login View (25 min)

### Prompt da copiare in Claude Code

```
Implementa frontend/src/views/LoginView.vue per SIAE+.

Usa <script setup lang="ts"> e Composition API.

Import:
- useAuthStore da '@/stores/authStore'
- apiService da '@/services/apiService'
- router da '@/router'
- validateEmail, validatePassword da '@/composables/useValidation'

State:
- email: ref<string>('')
- password: ref<string>('')
- errors: reactive({ email: '', password: '' })
- touched: reactive({ email: false, password: false })
- isLoading: ref<boolean>(false)
- loginError: ref<string>('') — messaggio errore generico del backend

isValid: computed(() => !errors.email && !errors.password && email.value && password.value)

handleLogin():
- isLoading.value = true
- loginError.value = ''
- Chiama apiService.login(email.value, password.value)
- Se successo: authStore.setToken(response.token), router.push('/dashboard')
- Se errore: loginError.value = "Credenziali non valide" (messaggio generico, mai specificare quale campo — RF-03)
- isLoading.value = false in finally

Template:
- Logo SIAE (usa img placeholder o testo)
- Titolo "Accedi a SIAE+"
- Campo email con validazione inline
- Campo password con toggle mostra/nascondi
- Messaggio errore generico loginError (se presente)
- Pulsante "Accedi" con spinner durante il caricamento
- Link "Non hai un account? Registrati" → router.push('/register')
- Mobile responsive

Fai il commit con "feat(frontend): add login view with jwt storage".
```

---

## Fase 5 — Dashboard post-login (30 min)

### Prompt da copiare in Claude Code

```
Implementa frontend/src/views/DashboardView.vue per SIAE+ (RF-04).

Questa schermata mostra i dati dell'utente loggato.

Setup della route: in router/index.ts aggiungi una navigation guard sulla route /dashboard:
- Prima di entrare, controlla authStore.isAuthenticated
- Se false: redirect a /login

State:
- user: ref<User | null>(null)
- isLoading: ref<boolean>(true)
- errorMessage: ref<string>('')

onMounted:
- Chiama apiService.getMe()
- Se successo: user.value = risposta
- Se errore (token scaduto ecc.): authStore.logout() (già fa redirect a /login)
- isLoading.value = false

Template (quando user è caricato):
- Sezione header: "Benvenuto, {user.firstName} {user.lastName}!"
- Sezione foto profilo:
  Se user.photo presente: <img :src="user.photo" alt="Foto profilo">
  (la foto è già in base64, src="data:image/jpeg;base64,...")
  Altrimenti: avatar placeholder con iniziali (firstName[0] + lastName[0])
- Sezione "I tuoi dati":
  Email, Codice fiscale, Telefono, Indirizzo
- Sezione "I tuoi repertori":
  Lista dei repertori (mappa ID → nome leggibile usando la stessa costante REPERTOIRES di Step5)
  Mostra come tag/badge
- Pulsante "Logout":
  onClick: authStore.logout()
  (authStore.logout() già fa router.push('/login') — vedi authStore di P2)

Stato di loading: mostra skeleton loader o spinner mentre isLoading è true.

Mobile responsive.

Fai il commit con "feat(frontend): add dashboard view with user data and logout".
```

---

## Fase 6 — Test Vitest (60 min)

### Prompt da copiare in Claude Code

```
Scrivi i test Vitest per i componenti Step5-8, LoginView e DashboardView.

File: frontend/src/components/registration/__tests__/Step5Repertorio.test.ts
1. Si renderizza con 6 repertori
2. Cliccando su un repertorio lo aggiunge a selectedRepertoires
3. "Avanti" è disabilitato se nessun repertorio è selezionato
4. "Avanti" è abilitato se almeno un repertorio è selezionato
5. Cliccando due volte sullo stesso repertorio lo deseleziona (toggle)
6. Con repertori validi, "Avanti" salva nel store e chiama nextStep

File: frontend/src/components/registration/__tests__/Step6Riepilogo.test.ts
1. Si renderizza mostrando i dati dello store
2. Il pulsante "Modifica" step 1 chiama goToStep(1)
3. "Conferma registrazione" chiama apiService.register
4. Se apiService.register fallisce con 409, mostra il messaggio errore
5. Se apiService.register ha successo, chiama nextStep

File: frontend/src/components/registration/__tests__/Step7Pagamento.test.ts
1. Con isUnder30() === true mostra il banner gratuità
2. Con isUnder30() === false mostra l'avviso quota
3. Con isUnder30() === false, "Continua" è disabilitato senza checkbox
4. Con isUnder30() === false, "Continua" è abilitato con checkbox checked

File: frontend/src/views/__tests__/LoginView.test.ts
1. Si renderizza con form email + password
2. Cliccando "Accedi" con campi vuoti non chiama apiService.login
3. Con credenziali valide chiama apiService.login
4. Se apiService.login ha successo, chiama authStore.setToken e router.push('/dashboard')
5. Se apiService.login fallisce, mostra messaggio generico "Credenziali non valide"
6. Il messaggio di errore NON specifica se è sbagliata email o password

File: frontend/src/views/__tests__/DashboardView.test.ts
1. Chiama apiService.getMe all'avvio
2. Mostra nome e cognome dell'utente
3. Mostra lista repertori
4. Se user.photo è presente, mostra l'img con src base64
5. Cliccando "Logout" chiama authStore.logout

Per i test che chiamano API, mocka apiService con vi.mock('@/services/apiService').
Per i test che usano store, usa setActivePinia(createPinia()) in beforeEach.

Esegui "npm run test -- --coverage" e mostrami il report completo.
Target: branches ≥ 70%, lines ≥ 70%, functions ≥ 70%, statements ≥ 70%.

Fai il commit con "test(frontend): add unit tests for steps 5-8 login and dashboard".
```

---

## Fase 7 — UI polish e mobile responsive (20 min)

### Prompt da copiare in Claude Code

```
Fai un passaggio finale di UI polish sull'app SIAE+.

1. Verifica che tutti i componenti siano mobile responsive:
   - Apri il browser in modalità dispositivo mobile (Chrome DevTools → iPhone 14 375px)
   - Verifica che i form siano leggibili e usabili
   - Le griglie devono collassare a colonna singola su mobile
   - I pulsanti devono essere almeno 44px di altezza (touch target)

2. Coerenza con il brand SIAE:
   - Colori primari SIAE: blu #003087, rosso #E30613
   - Font: usa il font del design system se disponibile, altrimenti sans-serif system
   - Applica il colore primario ai pulsanti principali (Avanti, Conferma, Accedi)
   - Applica stile secondario (outline) ai pulsanti di navigazione (Indietro, Salta)

3. Header comune: crea src/components/AppHeader.vue con:
   - Logo SIAE (testo "SIAE+" in grassetto blu se non hai l'immagine)
   - Non serve navigazione per ora

4. Aggiungi AppHeader in App.vue sopra <RouterView>

5. Verifica che il ProgressStepper (creato da P2) sia visibile e corretto su tutti gli step.

Fai il commit con "style(frontend): ui polish mobile responsive brand colors".
```

---

## Dipendenze verso gli altri

### Cosa ti serve da Persona 2

- Setup frontend completato: Vite, Pinia, Router, design system
- `registrationStore` con `isUnder30()`, `goToStep()`, `setRegistrationResult()`
- `authStore` con `setToken()`, `logout()`, `isAuthenticated`
- `apiService` con `login()`, `register()`, `getMe()`
- Placeholder `Step5Repertorio.vue` → `Step8Conferma.vue` già creati

### Cosa ti serve da Persona 3

- `useValidation.ts` con `validateEmail`, `validatePassword` (per LoginView)
- Nessuna dipendenza funzionale sugli step — lavorate in parallelo

### Cosa ti serve da Persona 1

- `POST /api/login` funzionante (per testare il login reale)
- `GET /api/users/me` funzionante (per la dashboard)

---

## Costante REPERTOIRES condivisa

Questa costante è usata sia in Step5 che in DashboardView. Esternalizzala in un file condiviso:

```typescript
// src/constants/repertoires.ts
export const REPERTOIRES = [
  { id: 'musica', label: 'Musica', emoji: '🎵' },
  { id: 'cinema', label: 'Cinema', emoji: '🎬' },
  { id: 'dor', label: 'DOR', description: 'Dramma e Opere Radiotelevisive', emoji: '🎭' },
  { id: 'lirica', label: 'Lirica', emoji: '🎤' },
  { id: 'opere_letterarie', label: 'Opere Letterarie', description: 'OLAF', emoji: '📚' },
  { id: 'arti_figurative', label: 'Arti Figurative', description: 'OLAF', emoji: '🎨' },
] as const

export type RepertoireId = typeof REPERTOIRES[number]['id']

export function getRepertoireLabel(id: string): string {
  return REPERTOIRES.find(r => r.id === id)?.label ?? id
}
```

---

## Commit da fare (in ordine)

```bash
feat(frontend): add step 5 - scelta repertorio
feat(frontend): add step 6 - riepilogo e conferma registrazione
feat(frontend): add step 7 - pagamento with age check
feat(frontend): add step 8 - conferma registrazione
feat(frontend): add login view with jwt storage
feat(frontend): add dashboard view with user data and logout
test(frontend): add unit tests for steps 5-8 login and dashboard
style(frontend): ui polish mobile responsive brand colors
```

---

## Checklist finale

- [ ] Step 5: selezione multipla repertori, almeno uno obbligatorio
- [ ] Step 6: riepilogo sola lettura, tutti i dati visibili, "Modifica" per ogni sezione
- [ ] Step 6: "Conferma registrazione" chiama `POST /api/register`, gestisce 409
- [ ] Step 7: logica under 30 (gratuità) vs over 30 (checkbox obbligatoria)
- [ ] Step 8: stato successo/errore con pulsante verso login
- [ ] LoginView: form email + password, messaggio errore generico (RF-03), JWT salvato in memoria
- [ ] DashboardView: dati utente da `GET /api/users/me`, foto base64, repertori, logout
- [ ] Navigation guard: /dashboard redirige a /login se non autenticato
- [ ] `REPERTOIRES` costante in file condiviso, usata da Step5 e Dashboard
- [ ] Mobile responsive: tutti i componenti funzionano a 375px
- [ ] Test Vitest: coverage ≥ 70%
- [ ] Tutti i test passano
- [ ] Nessun `any` non giustificato
- [ ] `<script setup lang="ts">` su tutti i componenti
