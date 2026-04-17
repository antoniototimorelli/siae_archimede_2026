---
name: brainstorming
description: | 
  TRIGGER: Usa questa skill quando l'utente chiede di implementare, creare, scrivere o aggiungere una feature non banale.
  TRIGGER: l'utente usa parole come "implementa", "crea", "scrivi", "aggiungi" riferite a codice o funzionalità che richiedono più di 10 righe di codice.
  NON-TRIGGER: domande teoriche ("come funziona X?"), richieste di spiegazione, sessioni di debug su codice esistente, refactor esplicito.
---

# Brainstorming — Analisi prima del codice

**Rischio: MEDIUM**

Prima di scrivere una sola riga di codice, completa questi step nell'ordine. Non procedere al successivo senza aver completato il precedente.

1. **Riformula il problema** — scrivi in una frase cosa deve fare esattamente il codice richiesto.
2. **Elenca i casi limite** — identifica almeno 3 scenari non-ovvi (input vuoto, valori nulli, concorrenza, permessi, edge di UI).
3. **Proponi 2-3 approcci alternativi** — per ognuno indica un pro e un contro concreti (non generici).
4. **Stima la complessità** — quante righe approssimative, quanti file toccati, quanto tempo stimato (banale/media/alta).
5. **Decidi**: se alta, scrivi un piano in docs/plans/ prima di procedere.
