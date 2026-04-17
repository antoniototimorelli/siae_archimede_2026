# SIAE Design System - Pacchetto Hackathon

Design system SIAE mobile-first (Vue 3 + Vite + Tailwind v4), pacchettizzato per uso offline.

## Cosa contiene

- `itsiae-siae-design-system-<versione>.tgz` — tarball npm del design system già buildato
- `README_HACKATHON.md` — questo file

Versione inclusa: **v1.0.3** (generata dal tag `v1.0.3` del repo `itsiae/siae-mobile-first-design-system`).

## Come installarlo in un progetto

Nessun accesso al registry GitHub richiesto: si installa dal file locale.

### 1. Copia il `.tgz` nel tuo progetto

Mettilo dove vuoi (es. radice del progetto o in una cartella `vendor/`).

### 2. Installalo come dipendenza

```bash
npm install ./itsiae-siae-design-system-1.0.3.tgz
# oppure
yarn add ./itsiae-siae-design-system-1.0.3.tgz
# oppure
pnpm add ./itsiae-siae-design-system-1.0.3.tgz
```

Verra' registrato nel tuo `package.json` come:

```json
"dependencies": {
  "@itsiae/siae-design-system": "file:./itsiae-siae-design-system-1.0.3.tgz"
}
```

### 3. Peer dependencies da installare

Il design system richiede (peerDependencies):

```bash
npm install vue@^3.5.17 vue-router@^4.5.1 @nuxt/ui@^3.2.0
```

### 4. Importa nel tuo progetto

```js
// main.ts
import '@itsiae/siae-design-system/dist/siae-design-system.css'
import * as SiaeDS from '@itsiae/siae-design-system'
```

## Build richiesto?

No. Il tarball contiene gia' la cartella `dist/` compilata (JS ES/UMD, types, CSS).

## Problemi?

Se `npm install` fallisce per le peer deps, prova:

```bash
npm install ./itsiae-siae-design-system-1.0.3.tgz --legacy-peer-deps
```

Buon hackathon!
