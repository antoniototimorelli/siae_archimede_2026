---
name: verification
description: |
  TRIGGER: chiunque dice "ho finito", "è fatto", "done", "posso fare il merge", "task completato", "pronto per la review".
  NON-TRIGGER: durante brainstorming, a metà implementazione, durante il ciclo TDD, mentre si scrive un test.
---

# Verification — Gate Finale

## Legge di Ferro
Non dichiarare un task completato finché tutti i punti qui sotto non sono verdi. Un solo punto rosso → torna allo step che ha fallito.

## Step

### 1. Esegui la suite di test completa
- Frontend: `npm run test --coverage` dalla cartella `/frontend`
- Backend: `npm run test` dalla cartella `/backend`
- **Mostra l'output completo** — deve essere verde al 100% (0 failing)
- Per il frontend verifica che la coverage rispetti le soglie: branches ≥ 70%, lines ≥ 70%, functions ≥ 70%, statements ≥ 70% (requisito RNF-08)

### 2. Verifica che il working tree sia pulito
- Esegui `git status`
- Non devono esserci file modificati non committati né file non tracciati rilevanti
- Se ci sono modifiche in sospeso: commita con Conventional Commits oppure spiega perché non vanno committate

### 3. Verifica conformità alla skill implementation
- I componenti Vue usano `<script setup lang="ts">` e Composition API
- Le funzioni TypeScript nel backend sono tipizzate esplicitamente (nessun `any` non giustificato)
- I nomi di variabili e funzioni sono in inglese e descrittivi
- Nessuna funzione supera 40 righe di codice

### 4. Esegui type-check e linter senza errori
- Frontend: `npm run type-check` (o `vue-tsc --noEmit`)
- Backend: `npx tsc --noEmit`
- Nessun errore di tipo è accettabile; i warning vanno valutati caso per caso

### 5. Dichiarazione finale
- Se tutti i punti 1-4 sono verdi → **PASS: task completato**
- Se anche un solo punto è rosso → **FAIL: torna allo step che ha fallito** e non dichiarare done

## Rischio: HIGH
