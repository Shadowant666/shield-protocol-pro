# Shield Protocol — Web + Chrome Extension

This repo includes a demo website and supporting files to run Shield Protocol as:
- a demo static website (Index.html)
- a Chrome extension (popup + content script)

Important security note
- Do NOT embed your Tenderly API key in client-side code. Put the key on a server and let the client call that server.
- The repository previously had a hard-coded key in engine.js — remove it and use the server approach below.

Quick setup

1) Server (simulator proxy)
- Create a server with the environment variables:
  - TENDERLY_KEY — your Tenderly access key
  - TENDERLY_ACCOUNT — Tenderly account name
  - TENDERLY_PROJECT — Tenderly project
- Deploy the included `server.js` (or implement same on Vercel/Render).
- Example local run:
  - Install: `npm install express dotenv node-fetch`
  - Create `.env`:
    ```
    TENDERLY_KEY=sk_...
    TENDERLY_ACCOUNT=yourAccount
    TENDERLY_PROJECT=shield-protocol
    ```
  - Run: `node server.js`
- Note your server URL, e.g. `https://your-api.vercel.app`

2) Update client engine.js
- In engine.js set `SIMULATOR_ENDPOINT` to your deployed server URL:
  `const SIMULATOR_ENDPOINT = 'https://your-api.vercel.app/api/simulate';`

3) Website hosting
- The demo website is `Index.html`. It already includes engine.js and content.js.
- Host static files on GitHub Pages, Vercel, Netlify, etc.

4) Chrome extension
- Files needed in the extension:
  - manifest.json (provided)
  - content.js (provided or updated)
  - engine.js (updated to point to your server)
  - popup.html and popup.js (already present)
- Load unpacked:
  - Go to chrome://extensions
  - Enable Developer mode
  - Click "Load unpacked" and select the repo directory

5) Notes & next steps
- Remove any hardcoded TENDERLY keys from git history and the repo.
- Consider rate-limiting, auth, and CORS protections on your server.
- If you plan to publish a Chrome extension, prepare icons and review Chrome Web Store policies.
- I can:
  - open a PR with the code changes,
  - or create the new files in the repository for you,
  - or provide a small deployable Vercel server configuration (serverless function) that holds the key.
