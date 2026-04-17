# Persona 3 — Frontend Steps 1–4: Form e Validazione

> **Ruolo**: sei responsabile dei primi 4 step del form di registrazione e di tutta la logica di validazione. Il tuo composable `useValidation` sarà usato da Persona 4 per gli step successivi.
>
> **Prerequisito**: aspetta che Persona 2 completi il setup frontend (circa 45 min). Nel frattempo lavora sul composable `useValidation.ts` — è puro TypeScript, non ha dipendenze Vue.
>
> **Stack**: Vue 3 Composition API · TypeScript · Vitest · Pinia · SIAE Design System

---

## Ordine di esecuzione

```
0:00 → 0:45   Scrivi useValidation.ts (puro TS, non serve il setup di P2)
0:45 → 1:15   Step 1 — Dati anagrafici
1:15 → 1:45   Step 2 — Credenziali
1:45 → 2:15   Step 3 — Dati di contatto
2:15 → 3:00   Step 4 — Caricamento foto
3:00 → 4:00   Test Vitest (obiettivo: >70% coverage)
```

---

## Fase 0 — Prima che P2 finisca: scrivi il composable (45 min)

Puoi fare questo anche senza il progetto Vue configurato. Crea solo il file TypeScript.

### Cosa deve fare `useValidation.ts`

Ogni funzione di validazione riceve un valore, ritorna `{ valid: boolean; error: string }`.
Se `valid` è `true`, `error` è stringa vuota.

### Regole di validazione richieste dalla traccia

| Campo | Regola |
|-------|--------|
| Nome / Cognome | Solo lettere (a-z, A-Z, àèìòùáéíóú, spazi), non vuoto |
| Codice fiscale | Esattamente 16 caratteri, formato: `[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]` |
| Email | Formato RFC standard: qualcosa@dominio.estensione |
| Password | Min 8 caratteri, almeno 1 lettera maiuscola, almeno 1 numero |
| Conferma password | Uguale alla password |
| Telefono | Solo cifre, minimo 9 caratteri |
| Indirizzo | Non vuoto, testo libero |

### Prompt da copiare in Claude Code

```
Crea frontend/src/composables/useValidation.ts nel progetto SIAE+.

Questo composable esporta funzioni di validazione pure (nessuna dipendenza Vue o Pinia).
Ogni funzione ritorna { valid: boolean; error: string }.

export interface ValidationResult {
  valid: boolean
  error: string
}

export function validateNome(value: string): ValidationResult
  - Non vuoto
  - Solo lettere (incluse lettere accentate italiane) e spazi
  - Regex: /^[a-zA-ZàèìòùáéíóúÀÈÌÒÙÁÉÍÓÚ\s]+$/
  - Messaggio errore: "Il nome può contenere solo lettere"

export function validateCognome(value: string): ValidationResult
  - Stesse regole di validateNome
  - Messaggio errore: "Il cognome può contenere solo lettere"

export function validateCodiceFiscale(value: string): ValidationResult
  - Non vuoto
  - Lunghezza esattamente 16 caratteri
  - Regex formato: /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i
  - Converti in uppercase prima di validare
  - Messaggio errore: "Codice fiscale non valido (formato: RSSMRA85M01H501Z)"

export function validateEmail(value: string): ValidationResult
  - Non vuoto
  - Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  - Messaggio errore: "Indirizzo email non valido"

export function validatePassword(value: string): ValidationResult
  - Non vuota
  - Min 8 caratteri
  - Almeno 1 lettera maiuscola: /[A-Z]/
  - Almeno 1 numero: /[0-9]/
  - Messaggio errore: "Password deve avere almeno 8 caratteri, una maiuscola e un numero"

export function validateConfirmPassword(password: string, confirm: string): ValidationResult
  - Non vuota
  - Uguale a password
  - Messaggio errore: "Le password non coincidono"

export function validateTelefono(value: string): ValidationResult
  - Non vuoto
  - Solo cifre: /^[0-9]+$/
  - Minimo 9 cifre
  - Messaggio errore: "Il numero di telefono deve contenere almeno 9 cifre"

export function validateIndirizzo(value: string): ValidationResult
  - Non vuoto (dopo trim)
  - Min 5 caratteri
  - Messaggio errore: "L'indirizzo è obbligatorio"

Esporta anche un helper:
export function isFormValid(results: ValidationResult[]): boolean
  - Ritorna true se TUTTI i risultati hanno valid: true

Fai il commit con "feat(frontend): add useValidation composable with form validators".
```

---

## Fase 1 — Step 1: Dati anagrafici (30 min)

### Prompt da copiare in Claude Code

```
Implementa frontend/src/components/registration/Step1Anagrafica.vue per SIAE+.

Questo componente gestisce il primo step del flusso di registrazione.

Usa <script setup lang="ts"> e Composition API.

Import necessari:
- useRegistrationStore da '@/stores/registrationStore'
- validateNome, validateCognome, validateCodiceFiscale, isFormValid da '@/composables/useValidation'

State locale (ref tipizzati):
- firstName: ref<string>('') — inizializzato da registrationStore.data.firstName se già compilato
- lastName: ref<string>('')
- fiscalCode: ref<string>('')
- errors: reactive({ firstName: '', lastName: '', fiscalCode: '' })
- touched: reactive({ firstName: false, lastName: false, fiscalCode: false })
  (un campo diventa "touched" quando l'utente lo lascia — onBlur)

Computed:
- isValid: computed(() => isFormValid([
    validateNome(firstName.value),
    validateCognome(lastName.value),
    validateCodiceFiscale(fiscalCode.value)
  ]))

Metodi:
- validateField(field: 'firstName' | 'lastName' | 'fiscalCode'): void
  Imposta errors[field] con il risultato della validazione corrispondente
  Imposta touched[field] = true
- handleNext(): void
  Valida tutti i campi (touched = true per tutti)
  Se isValid: chiama registrationStore.updateData({ firstName, lastName, fiscalCode })
  poi registrationStore.nextStep()
  Se non valido: non avanza

Template:
- Titolo "Dati anagrafici"
- 3 campi input (firstName, lastName, fiscalCode)
- Ogni campo mostra errore inline sotto il campo SE touched[field] && errors[field]
- Usa i componenti del design system @itsiae/siae-design-system se disponibili (SiaeInput, SiaeButton)
  altrimenti usa input HTML standard con classi Tailwind
- Pulsante "Avanti" disabilitato se !isValid, chiama handleNext() al click
- Il pulsante "Indietro" non c'è allo step 1

Stile: mobile responsive, coerente con il brand SIAE.

Fai il commit con "feat(frontend): add step 1 - dati anagrafici with validation".
```

---

## Fase 2 — Step 2: Credenziali (30 min)

### Prompt da copiare in Claude Code

```
Implementa frontend/src/components/registration/Step2Credenziali.vue per SIAE+.

Stesso pattern di Step1Anagrafica.vue.

Campi:
- email: ref<string>('')
- password: ref<string>('') — input type="password" con toggle mostra/nascondi
- confirmPassword: ref<string>('')

Validazioni:
- validateEmail(email.value)
- validatePassword(password.value)
- validateConfirmPassword(password.value, confirmPassword.value)
  Nota: la validazione di confirmPassword dipende dal valore di password.
  Ricalcolala ogni volta che password cambia (usa watch o computed annidato).

Comportamento speciale:
- Quando password cambia, ri-valida anche confirmPassword se è già touched
- Mostra un indicatore visivo della forza della password (opzionale, bonus):
  weak / medium / strong in base a quanti criteri sono soddisfatti

Template:
- Titolo "Credenziali di accesso"
- Campo email con validazione
- Campo password con toggle eye icon (type password ↔ text)
- Campo conferma password
- Errori inline per ogni campo
- Pulsanti "Indietro" (registrationStore.prevStep()) e "Avanti"
- "Avanti" disabilitato se !isValid

handleNext():
- Salva nel store: registrationStore.updateData({ email, password })
  NON salvare confirmPassword nel store
- Chiama registrationStore.nextStep()

Fai il commit con "feat(frontend): add step 2 - credenziali with password validation".
```

---

## Fase 3 — Step 3: Dati di contatto (20 min)

### Prompt da copiare in Claude Code

```
Implementa frontend/src/components/registration/Step3Contatti.vue per SIAE+.

Stesso pattern degli step precedenti.

Campi:
- phone: ref<string>('')
- address: ref<string>('')

Validazioni:
- validateTelefono(phone.value)
- validateIndirizzo(address.value)

Per il campo telefono:
- type="tel" per mobile keyboard numerica
- Mostra un campo con prefisso +39 visibile (decorativo, non incluso nel valore salvato)

Per l'indirizzo:
- textarea, non input
- resize: none
- min-height: 80px

Template:
- Titolo "Dati di contatto"
- Campo telefono
- Textarea indirizzo
- Errori inline
- Pulsanti "Indietro" e "Avanti"

handleNext():
- registrationStore.updateData({ phone, address })
- registrationStore.nextStep()

Fai il commit con "feat(frontend): add step 3 - dati contatto".
```

---

## Fase 4 — Step 4: Caricamento foto (45 min)

Questo è lo step più complesso del tuo set. La foto è opzionale, ma la validazione della qualità è obbligatoria se caricata.

### Logica di validazione foto

La traccia dice: "Se l'immagine non è in primo piano o è sfocata, mostra errore". Non esiste un algoritmo reale per rilevare volti o sfocatura via browser senza ML. L'approccio accettabile:

1. **Dimensioni minime**: l'immagine deve essere almeno 200x200 pixel (indica che è una foto, non un'icona)
2. **Dimensione file**: non più di 5MB
3. **Tipo file**: solo immagini (image/jpeg, image/png, image/webp)
4. Mostra il messaggio: "Assicurati che la foto mostri chiaramente il tuo viso in primo piano"

### Prompt da copiare in Claude Code

```
Implementa frontend/src/components/registration/Step4Foto.vue per SIAE+.

Questo step è opzionale: l'utente può saltarlo con "Salta questo step" (nextStep senza salvare foto).

Logica caricamento:
- Input type="file" nascosto, attivato da un pulsante "Carica foto"
- Accetta: image/jpeg, image/png, image/webp
- Limite: 5MB (controlla file.size < 5 * 1024 * 1024)

Dopo la selezione del file, esegui queste validazioni:
1. Controlla il tipo MIME
2. Controlla le dimensioni del file (max 5MB)
3. Carica l'immagine in un elemento <img> invisibile per leggere le dimensioni reali:
   const img = new Image()
   img.onload = () => { width = img.naturalWidth; height = img.naturalHeight }
   img.src = URL.createObjectURL(file)
4. Se width < 200 o height < 200:
   mostra errore "La foto è troppo piccola. Usa una foto che mostri chiaramente il tuo viso."
5. Converti in base64: usa FileReader.readAsDataURL
6. Salva il risultato in photoBase64: ref<string>('')

State:
- photoBase64: ref<string>('') — la stringa base64 completa (incluso data:image/jpeg;base64,...)
- previewUrl: ref<string>('') — URL per mostrare l'anteprima
- photoError: ref<string>('')
- isPhotoValid: ref<boolean>(false)

Template:
- Titolo "Foto profilo (opzionale)"
- Testo informativo: "Carica una foto che mostri chiaramente il tuo viso in primo piano"
- Area di drop con icona placeholder (o preview se già caricata)
- Pulsante "Carica foto" che apre l'input file
- Se foto caricata: mostra anteprima con elemento <img :src="previewUrl">
- Errore inline sotto l'area foto (se presente)
- Pulsante "Rimuovi foto" (se foto presente)
- Pulsanti: "Indietro", "Salta questo step" (procede senza salvare), "Avanti" (attivo solo se foto valida O non caricata)

handleNext():
- Se photoBase64 non vuoto: registrationStore.updateData({ photo: photoBase64.value })
- registrationStore.nextStep()

handleSkip():
- Non aggiorna lo store
- registrationStore.nextStep()

Fai il commit con "feat(frontend): add step 4 - foto upload with validation".
```

---

## Fase 5 — Test Vitest (60 min — CRITICO per la valutazione)

Obiettivo: 70% di coverage su tutto il codice degli step 1-4 e useValidation.

### Prompt da copiare in Claude Code

```
Scrivi i test Vitest per il composable useValidation e per i componenti Step1-Step4.

File: frontend/src/composables/__tests__/useValidation.test.ts

Test per validateNome:
1. 'Mario' → valid: true
2. '' → valid: false, error non vuoto
3. 'Mario123' → valid: false (contiene numeri)
4. 'Maria Grazia' → valid: true (spazi ok)
5. 'Ò' → valid: true (lettere accentate ok)

Test per validateCodiceFiscale:
1. 'RSSMRA85M01H501Z' → valid: true
2. 'rssmra85m01h501z' → valid: true (case insensitive)
3. 'ABC' → valid: false (troppo corto)
4. '' → valid: false

Test per validateEmail:
1. 'test@example.com' → valid: true
2. 'invalid-email' → valid: false
3. '' → valid: false
4. 'test@' → valid: false

Test per validatePassword:
1. 'Password1' → valid: true
2. 'password1' → valid: false (manca maiuscola)
3. 'Password' → valid: false (manca numero)
4. 'Pa1' → valid: false (troppo corta)

Test per validateConfirmPassword:
1. ('Password1', 'Password1') → valid: true
2. ('Password1', 'Password2') → valid: false
3. ('Password1', '') → valid: false

Test per validateTelefono:
1. '0612345678' → valid: true
2. '12345' → valid: false (meno di 9 cifre)
3. 'abc12345678' → valid: false (contiene lettere)
4. '' → valid: false

Test per isFormValid:
1. Array di risultati tutti valid: true → true
2. Array con almeno uno valid: false → false

---

File: frontend/src/components/registration/__tests__/Step1Anagrafica.test.ts

Setup con @vue/test-utils e setActivePinia(createPinia()):

Test:
1. Il componente si renderizza senza errori
2. Il pulsante "Avanti" è disabilitato se i campi sono vuoti
3. Il pulsante "Avanti" è abilitato se tutti i campi sono validi
4. Inserendo 'Mario123' nel campo firstName mostra l'errore dopo blur
5. Cliccando "Avanti" con dati validi aggiorna lo store
6. Cliccando "Avanti" con dati validi chiama registrationStore.nextStep()

Test per Step2Credenziali:
1. Si renderizza
2. "Avanti" disabilitato con campi vuoti
3. Errore su password se manca la maiuscola
4. Errore su confirmPassword se non coincide con password
5. "Avanti" con dati validi salva nel store (senza confirmPassword)

Test per Step3Contatti:
1. Si renderizza
2. Errore su telefono se contiene lettere
3. Errore su telefono se meno di 9 cifre
4. "Avanti" con dati validi chiama nextStep

Test per Step4Foto:
1. Si renderizza
2. Il pulsante "Salta" chiama nextStep senza aggiornare lo store
3. Con foto valida caricata, "Avanti" diventa attivo

Esegui "npm run test -- --coverage" e mostrami il report.
Target: branches ≥ 70%, lines ≥ 70%, functions ≥ 70%, statements ≥ 70%.

Se la coverage è sotto, aggiungi i test mancanti prima di considerare il task completo.

Fai il commit con "test(frontend): add unit tests for steps 1-4 and useValidation".
```

---

## Dipendenze verso gli altri

### Cosa fornisci a Persona 4

Il composable `useValidation.ts` è condiviso. Persona 4 può importarlo per validazioni custom negli step 5-8.

```typescript
// Persona 4 può fare:
import { validateEmail, isFormValid, type ValidationResult } from '@/composables/useValidation'
```

### Cosa ti serve da Persona 2

- Setup frontend completato (Fase 1 di P2): Vite, Pinia, Router, design system
- `registrationStore.ts` con `updateData`, `nextStep`, `prevStep`, `currentStep`
- Placeholder `Step1Anagrafica.vue` → `Step4Foto.vue` già creati (li sovrascrivi)

### Cosa ti serve da Persona 1

Niente direttamente — lavori solo sul frontend.

---

## Commit da fare (in ordine)

```bash
feat(frontend): add useValidation composable with form validators
feat(frontend): add step 1 - dati anagrafici with validation
feat(frontend): add step 2 - credenziali with password validation
feat(frontend): add step 3 - dati contatto
feat(frontend): add step 4 - foto upload with validation
test(frontend): add unit tests for steps 1-4 and useValidation
```

---

## Checklist finale

- [ ] `useValidation.ts` esporta tutte le funzioni con i tipi corretti
- [ ] Step 1: validazione nome (solo lettere), cognome (solo lettere), CF (16 char + regex)
- [ ] Step 2: validazione email, password (min 8, 1 maiuscola, 1 numero), conferma password
- [ ] Step 3: validazione telefono (min 9 cifre), indirizzo (non vuoto)
- [ ] Step 4: upload foto, preview, validazione dimensioni, pulsante "Salta"
- [ ] Ogni step: errori mostrati inline, solo dopo blur o dopo click "Avanti"
- [ ] Ogni step: "Avanti" disabilitato finché il form non è valido
- [ ] I dati vengono salvati nel `registrationStore` prima di avanzare
- [ ] Pulsante "Indietro" presente dagli step 2-4
- [ ] Test Vitest: coverage ≥ 70% su branches, lines, functions, statements
- [ ] Tutti i test passano (0 failing)
- [ ] Componenti usano `<script setup lang="ts">`, mai Options API
- [ ] Nessun `any` non giustificato
