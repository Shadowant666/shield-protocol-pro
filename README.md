# Shield Protocol — Serverless simulator proxy + extension demo

This branch adds a server-side simulator proxy and updates the client to call the serverless endpoint instead of embedding Tenderly keys.

Immediate steps you already did
1. Rotate the leaked Tenderly key in the Tenderly dashboard and revoke the old key.
2. Add TENDERLY_KEY to Vercel env vars (done).

Finish these now
1. Add TENDERLY_ACCOUNT and TENDERLY_PROJECT to Vercel env vars.
2. Add VERCEL_TOKEN as a GitHub repository secret (Repo → Settings → Secrets and variables → Actions).
3. Add/commit the files in this branch and open the PR.

How to set the simulator endpoint in the client
- Recommended (runtime, preferred): set the global variable before loading engine.js
  <script>
    window.SHIELD_SIMULATOR_ENDPOINT = "https://<your-vercel-host>/api/simulate";
  </script>
  <script src="engine.js"></script>

Vercel env vars
- TENDERLY_KEY (already set)
- TENDERLY_ACCOUNT
- TENDERLY_PROJECT

Security reminders
- Do NOT put TENDERLY_KEY into client code (engine.js or extension files).
- Replace Access-Control-Allow-Origin "*" in api/simulate.js with your origin before production.
- If you want to remove the leaked key from git history, follow git-filter-repo or BFG steps (dangerous — coordinate with collaborators).

Testing checklist
- Local site: open index.html and ensure simulation button POSTs to SHIELD_REPORT and modal appears.
- Extension: load unpacked extension and verify content.js injects engine.js; verify popup still functions.
- Wallet flows:
  - eth_requestAccounts should prompt engine to show allow modal; after allow it forwards to wallet.
  - eth_sendTransaction should POST to /api/simulate and show results; user must approve to forward the tx to wallet.
