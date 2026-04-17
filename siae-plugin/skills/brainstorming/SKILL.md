---
name: brainstorming
description: |
  TRIGGER: l'utente usa parole come "implementa", "crea", "scrivi", "aggiungi" riferite a codice o funzionalità.
  NON-TRIGGER: domande teoriche ("come funziona X?"), richieste di spiegazione, sessioni di debug su codice esistente, refactor esplicito.
---

# Brainstorming — Analisi prima del codice

**Rischio: LOW**

Prima di scrivere una sola riga di codice, completa questi step nell'ordine. Non procedere al successivo senza aver completato il precedente.

1. **Riformula il problema** — scrivi in una frase cosa deve fare esattamente il codice richiesto.
2. **Elenca i casi limite** — identifica almeno 3 scenari non-ovvi (input vuoto, valori nulli, concorrenza, permessi, edge di UI).
3. **Proponi 2-3 approcci alternativi** — per ognuno indica un pro e un contro concreti (non generici).
4. **Stima la complessità** — quante righe approssimative, quanti file toccati, quanto tempo stimato.
5. **Ottieni conferma** — presenta il piano all'utente e aspetta un esplicito "ok" o "procedi".

> Claude non scrive codice finché lo step 5 non è completato con conferma ricevuta.
