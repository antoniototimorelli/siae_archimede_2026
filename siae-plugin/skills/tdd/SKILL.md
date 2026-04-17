---
name: tdd
description: |
  TRIGGER: Claude sta per implementare una nuova funzione, metodo, componente Vue o modulo TypeScript (composable, store Pinia, service Express, utility).
  NON-TRIGGER: modifica di test già esistenti senza nuova logica, refactor puro già coperto da test verdi, correzioni di typo o commenti.
---

# TDD — RED → GREEN → REFACTOR

**Rischio: MEDIUM**

Saltare una fase può produrre codice non testato o test che non verificano nulla di reale.

Gli step sono **sequenziali e non saltabili**. Claude non avanza allo step successivo senza aver completato e mostrato l'output del precedente.

---

## Step 1 — RED: scrivi il test prima del codice

1. Formula il comportamento atteso in una frase: _"dato X, quando Y, allora Z"_.
2. Scrivi un test Vitest che verifichi **solo** quel comportamento — nient'altro.
3. Esegui il test: **deve fallire**. Se passa subito, il test non verifica nulla di nuovo — riscrivilo.

```ts
// Struttura test
import { describe, it, expect } from 'vitest'

describe('nomeUnità', () => {
  it('dato X, quando Y, allora Z', () => {
    // arrange
    // act
    // assert
    expect(actual).toBe(expected)
  })
})
```

> **Gate:** mostra l'output del test fallente prima di procedere allo Step 2.

---

## Step 2 — GREEN: scrivi il minimo codice per far passare il test

1. Scrivi **solo** il codice necessario a far passare il test dello Step 1 — niente di più.
2. Non ottimizzare, non aggiungere feature non richieste, non gestire casi non coperti dal test attuale.
3. Esegui il test: **deve passare**. Se fallisce ancora, correggi solo il codice di produzione.

> **Gate:** mostra l'output verde prima di procedere allo Step 3.

---

## Step 3 — REFACTOR: migliora senza cambiare il comportamento

1. Elimina duplicazioni nel codice di produzione e nei test.
2. Verifica che il codice rispetti gli standard definiti nella skill `implementation` (naming, struttura file, regole TypeScript e Vue).
4. Riesegui i test: **devono continuare a passare**. Se falliscono hai cambiato il comportamento — ripristina.
5. Se emergono nuovi comportamenti da testare, torna allo Step 1 con un nuovo ciclo RED.

> **Gate:** mostra l'output finale dei test e il codice refactored prima di dichiarare lo step completato.

---

## Regole di completamento

- Un ciclo RED → GREEN → REFACTOR copre **un solo comportamento** alla volta.
- Copertura minima target: **70%** sulle unità create nella sessione.
- Al termine del ciclo, invocare la skill `verification` prima del commit.
