// Public client engine.js (update or replace your existing engine.js with the runtime-safe changes below)
// NOTE: This file must NOT contain any Tenderly API key.
//
// Usage:
// - Recommended: set window.SHIELD_SIMULATOR_ENDPOINT = "https://<your-vercel-host>/api/simulate"
//   before loading this script (e.g., small inline <script> before <script src="engine.js">).
// - Fallback: Edit the __FALLBACK_SIMULATOR_URL__ constant below only if you must hard-code the URL
//   (avoid committing keys or hostnames to git).
(function () {
  const __FALLBACK_SIMULATOR_URL__ = "__REPLACE_ME__"; // Replace only if you must (avoid committing)

  function getSimulatorEndpoint() {
    if (typeof window !== "undefined" && window.SHIELD_SIMULATOR_ENDPOINT) {
      return window.SHIELD_SIMULATOR_ENDPOINT;
    }
    if (__FALLBACK_SIMULATOR_URL__ && __FALLBACK_SIMULATOR_URL__ !== "__REPLACE_ME__") {
      return __FALLBACK_SIMULATOR_URL__;
    }
    throw new Error(
      "SHIELD_SIMULATOR_ENDPOINT not set. Set window.SHIELD_SIMULATOR_ENDPOINT = 'https://<your-vercel-host>/api/simulate' BEFORE loading engine.js, or edit engine.js to add a fallback URL."
    );
  }

  async function runSimulation(simRequestBody) {
    const endpoint = getSimulatorEndpoint();

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(simRequestBody),
      credentials: "omit",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Simulator proxy error: ${res.status} ${res.statusText} ${text}`);
    }

    const json = await res.json();
    return json;
  }

  // Example helper used by the engine to request a simulation. Adapt to your existing callsite.
  window.SHIELD = window.SHIELD || {};
  window.SHIELD.simulateViaServer = async function (report) {
    // report should be shaped as your server expects (e.g., SHIELD_REPORT).
    // Keep this minimal: don't include secrets.
    try {
      const result = await runSimulation({ report });
      return result;
    } catch (err) {
      console.error("Simulation failed:", err);
      throw err;
    }
  };

  // Optionally expose a convenience method for your extension's content script:
  window.SHIELD.getSimulatorEndpoint = getSimulatorEndpoint;
})();
