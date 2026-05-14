# CLAUDE.md

## Project Overview

`devtools-detect` is a zero-dependency browser library that detects whether the browser's Developer Tools panel is open, and determines its orientation (vertical or horizontal). It exports a live-updating state object and dispatches `devtoolschange` DOM events when state changes.

**npm package:** `devtools-detect` (v4.0.0)  
**Author:** Sindre Sorhus  
**License:** MIT

---

## Repository Layout

```
devtools-detect/
├── index.js            # Entire library — detection logic, state object, event dispatch
├── index.d.ts          # TypeScript type definitions (published to npm)
├── index.test-d.ts     # tsd type-level tests (not published)
├── index.html          # Interactive browser demo
├── package.json        # Package metadata, scripts, xo config
├── readme.md           # Public-facing documentation
├── .editorconfig       # Code style (tabs, LF, UTF-8)
├── .npmrc              # Disables package-lock.json
├── .gitignore
└── .github/
    └── workflows/
        └── main.yml    # CI: runs npm test on Node 16
```

Only `index.js` and `index.d.ts` are published to npm (see `"files"` in package.json).

---

## Technology Stack

- **Language:** JavaScript (ESM only, `"type": "module"`)
- **Runtime target:** Browser (no Node.js runtime behavior)
- **Types:** TypeScript definitions via `index.d.ts`
- **Linter:** [xo](https://github.com/xojs/xo) — opinionated ESLint wrapper
- **Type tests:** [tsd](https://github.com/SamVerschueren/tsd)
- **No build step** — library is shipped as-is

---

## Development Commands

```bash
npm install      # Install dev dependencies (xo, tsd)
npm test         # Run linter (xo) and type tests (tsd)
```

There is no separate build, bundle, or compile step. The source file IS the published artifact.

---

## How the Library Works

**Detection method:** Compares `window.outerWidth/outerHeight` against `window.innerWidth/innerHeight`. A difference exceeding the 160px threshold indicates DevTools is open.

**Orientation:** If width difference exceeds threshold → `'vertical'`; if height difference does → `'horizontal'`.

**Polling:** `setInterval(main, 500)` — checks every 500ms. The initial check runs once at import time with events suppressed (`emitEvents: false`).

**Events:** Dispatches a `devtoolschange` CustomEvent on `window` when `isOpen` or `orientation` changes. Event `detail` contains `{ isOpen, orientation }`.

**Firefox Firebug:** Special-cased via `globalThis.Firebug.chrome.isInitialized`.

**Known limitations:**
- Does not detect undocked DevTools windows
- May false-positive if browser sidebars toggle (e.g., bookmarks panel)
- Browser zoom can cause false positives

---

## Code Conventions

- **Indentation:** Tabs (enforced by `.editorconfig` and xo)
- **Line endings:** LF
- **Module format:** ES Modules only — no `require()`, no CJS
- **Exports:** Single default export (`export default devtools`)
- **Naming:** camelCase for variables/functions; boolean state properties prefixed with `is` (e.g., `isOpen`)
- **Comments:** Minimal — only the license header at the top of `index.js`
- **No external runtime dependencies**

---

## TypeScript Definitions

`index.d.ts` provides:
- `Orientation` — `'vertical' | 'horizontal'` union type
- `DevToolsEvent` — extends `Event` with `detail: { isOpen: boolean; orientation?: Orientation }`
- Augments `Window` to add a typed `devtoolschange` event listener overload
- All state properties are `readonly`

Type correctness is validated by `index.test-d.ts` using `tsd` (`expectType<>` assertions). Run via `npm test`.

---

## CI

GitHub Actions (`.github/workflows/main.yml`):
- Triggers on `push` and `pull_request`
- Runs on `ubuntu-latest`, Node.js 16
- Steps: checkout → setup-node → `npm install` → `npm test`

---

## Making Changes

1. Edit `index.js` for behavior changes — it is the sole runtime file.
2. Update `index.d.ts` for any API surface changes, and add corresponding assertions to `index.test-d.ts`.
3. Run `npm test` to verify linting and type correctness pass before committing.
4. Do not introduce a build step, bundler, or runtime dependencies.
5. Keep the module ESM-only — do not add CommonJS exports or dual-package shims.
