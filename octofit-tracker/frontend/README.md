# OctoFit Tracker Frontend

This React 19 + Vite app uses `react-router-dom` and reads API data from the backend service.

## Environment variable

Define `VITE_CODESPACE_NAME` in `.env.local` when running in GitHub Codespaces.

Example `.env.local`:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

The app builds API URLs as:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

Safe fallback is enabled. If `VITE_CODESPACE_NAME` is not set, the app uses:

```text
http://localhost:8000/api/[component]/
```

## Start

```bash
npm install --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/frontend
```
