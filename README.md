# Enpreview

Enpreview is a desktop companion for Barco Event Master operators. It talks to the frame over the JSON-RPC API on port `9999`, feeding tally and destination state into a configurable Electron + Svelte interface so you always know what is live, on preview, or listening.

## Download

[**Download the latest version for Mac, Windows, and Linux**](https://github.com/lead-led/enpreview/releases/latest)

---

**Project links**

- `docs/` contains API experiments and response captures under `response_objects/` for reference.
- Releases are built with Electron Builder scripts in `package.json`.

**Issue tracking**

- File bugs or feature ideas through your team's normal workflow (this repository ships without Git metadata by default).

---

## Key features

- JSON-RPC polling of Event Master destinations and layer content.
- Visual tally indicators for program, preview, and listened destinations.
- Electron shell with draggable windows for overlay-style monitoring.
- Carbon Components Svelte UI with themeable widgets.

## Architecture notes

- `src/main/classes/backendService.cjs` boots an Express server (default port `6788`) that receives Event Master subscription callbacks and relays them to renderer windows.
- `src/main/classes/RequestController.cjs` issues HTTP POST requests to `http://<frame>:9999` for methods such as `listPresets`, `listContent`, and `subscribe`.
- `response_objects/` captures real Event Master responses for reference when iterating on parsing logic.

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

## Release Workflow

This project uses a hybrid release workflow:

- **Windows** builds are handled by GitHub Actions.
- **Mac & Linux** builds are handled locally on your machine.
- All artifacts are uploaded to the same GitHub Release.

### Prerequisites

1. Create a **Personal Access Token (Classic)** on GitHub with `repo` scope.
2. Add it to a `.env` file in the project root:
    ```bash
    GH_TOKEN=ghp_your_token_here
    ```

### Creating a Release

Run the interactive release script:

```bash
npm run release-interactive
```

This script will:

1. Prompt you for the version bump (patch, minor, major).
2. Update `package.json`, commit, and tag the release.
3. Push the tag to GitHub (triggering the Windows build Action).
4. Build and upload Mac & Linux artifacts from your local machine.

## Troubleshooting

- Response samples in `response_objects/` illustrate the expected payloads from Event Master APIs.
- If tally data stops updating, confirm the backend Express listener is reachable from the frame and that subscriptions (`ScreenDestChanged`, `AuxDestChanged`) are posting to it—these trigger refresh calls for `listContent` and `listAuxContent`.

## License

Enpreview is distributed under the PolyForm Noncommercial License 1.0.0. See `LICENSE` for full terms.
