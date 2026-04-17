---
name: implementation
description: |
  TRIGGER: Claude sta per scrivere o modificare codice sorgente (componenti Vue, composable, store Pinia, route, servizi Express, file TypeScript).
  NON-TRIGGER: analisi/brainstorming prima della conferma utente, spiegazioni teoriche, modifiche a soli file di configurazione non-codice.
---

# Implementation — Standard di codice SIAE+

**Rischio: MEDIUM**

Codice prodotto modifica file sorgente; un errore di tipo o di logica può rompere la build o introdurre regressioni.

## Checklist pre-scrittura

Prima di aprire qualsiasi file di produzione, verificare:

1. **Esiste un test RED** — la skill TDD deve aver prodotto almeno un test fallente. Se non esiste, fermarsi e invocare la skill TDD.
2. **Il file è al posto giusto** — rispettare la struttura:
   - `src/components/` → componenti Vue riutilizzabili (`PascalCase.vue`)
   - `src/views/` → pagine legate a una route (`PascalCase` + suffisso `View`)
   - `src/stores/` → store Pinia (`camelCase` + suffisso `Store`, `.ts`)
   - `src/composables/` → composable (prefisso `use`, `.ts`)
   - `src/types/` → interfacce e tipi di dominio condivisi (`.ts`)
   - `backend/src/routes/` / `controllers/` / `services/` → Express backend

## Regole Vue 3

- Sempre `<script setup lang="ts">` prima del `<template>` — mai Options API.
- Props: `defineProps<T>()` — sempre tipizzate, nessun campo `any`.
- Emits: `defineEmits<{ (e: 'event', payload: T): void }>()` — sempre tipizzati.
- Nessun `ref` senza tipo: usare `ref<T>()` esplicito.
- Stili con classi Tailwind v4 in `class=`; nessun `style` inline, nessun CSS scoped salvo casi eccezionali.
- Non costruire componenti già presenti in `@itsiae/siae-design-system` (Button, Input, Modal…).

## Regole TypeScript

- `"strict": true` attivo — nessun `any` implicito.
- Usare `unknown` + type guard quando il tipo è realmente sconosciuto.
- Tipi di dominio condivisi in `src/types/`; non ripetere la stessa forma in più file.
- Alias `@/` per import che superano un livello di directory relativa.
- Naming: `PascalCase` per tipi/classi, `camelCase` per funzioni/variabili, `SCREAMING_SNAKE_CASE` per costanti modulo, `kebab-case` per file non-componenti.

## Regole Design System

- In `main.ts`: `import '@itsiae/siae-design-system/dist/siae-design-system.css'` e `import * as SiaeDS from '@itsiae/siae-design-system'`.
- Non usare classi Tailwind per ricreare componenti già esposti dal DS.

## Flusso obbligatorio

1. Test RED presente → procedi a scrivere il minimo codice per farlo passare (GREEN).
2. Refactor: elimina duplicazioni, correggi naming, verifica che i tipi siano esatti.
3. Invoca `agents/reviewer.md` sull'output prodotto.
4. Invoca la skill `verification` — non dichiarare il task completato prima di questo gate.

> Claude non dichiara un'implementazione completa finché lo step 4 non restituisce esito positivo.
