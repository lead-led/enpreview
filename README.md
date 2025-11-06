# EM Tally

EM Tally is a desktop companion for Barco Event Master operators. It polls the processor over OSC and HTTP, then surfaces tally and destination state in a configurable Electron + Svelte interface so you always know what is live, on preview, or listening.

---

**Project links**

- `docs/` contains API experiments and response captures under `response_objects/` for reference.
- Releases are built with Electron Builder scripts in `package.json`.

**Issue tracking**

- File bugs or feature ideas through your team's normal workflow (this repository ships without Git metadata by default).

---

## Key features

- Real-time polling of Event Master destinations and layer content.
- Visual tally indicators for program, preview, and listened destinations.
- Electron shell with draggable windows for overlay-style monitoring.
- Carbon Components Svelte UI with themeable widgets.

## Getting started

```bash
npm install
npm run dev        # launches Vite/Svelte and Electron together
```

The dev script starts two processes via `concurrently`: the Svelte frontend (`npm run dev:svelte`) and the Electron host (`npm run dev:electron`). When developing UI-only changes you can run `npm run dev:svelte` on its own.

## Building

```bash
npm run build          # builds Svelte + Electron bundles
npm run dist           # packages desktop binaries with electron-builder
```

Artifacts are written to `dist/` and `build/` depending on the target platform. See `electron-builder.json` for platform-specific configuration.

## Troubleshooting

- Response samples in `response_objects/` illustrate the expected payloads from Event Master APIs.
- If tally data stops updating, confirm the OSC subscriptions (`ScreenDestChanged`, `AuxDestChanged`) are flowing—these trigger refresh calls for `listContent` and `listAuxContent`.

## License

EM Tally is distributed under the PolyForm Noncommercial License 1.0.0. See `LICENSE` for full terms.
