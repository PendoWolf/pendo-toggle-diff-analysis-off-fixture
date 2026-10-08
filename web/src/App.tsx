import { useEffect, useState } from "react";
import { api, type AppState } from "./api";

type Action = "load" | "increment" | "decrement" | "reset" | "refresh";

// Seam for Pendo. Novus installs the Pendo agent, which provides window.pendo
// at runtime; this fires a Track Event. No-op when the agent isn't present
// (local dev), so the app and Playwright mocks both stay simple. Pendo matches
// event names exactly (case-sensitive), so pass them verbatim.
function trackEvent(name: string, props: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    try {
      window.pendo?.track?.(name, props);
    } catch {
      // Analytics must never break the app or be reported as a failed action.
    }
  }
}

// Fires the Track Event for an action that succeeded. `prev` is the state on
// screen when the action started; `next` is the API response. The counter is
// shared by all visitors, so `counter` is always the global value.
function trackSuccess(action: Action, prev: AppState, next: AppState) {
  switch (action) {
    case "load":
      // The state each visitor sees on arrival.
      trackEvent("demo-load", { counter: next.counter, lastAction: next.lastAction });
      break;
    case "increment":
      trackEvent("demo-increment", { counter: next.counter });
      break;
    case "decrement":
      trackEvent("demo-decrement", { counter: next.counter });
      break;
    case "reset":
      // The response is always 0 / "reset", so report what was discarded.
      trackEvent("demo-reset", { previousCounter: prev.counter, previousLastAction: prev.lastAction });
      break;
    case "refresh":
      // counter !== previousCounter means another visitor changed the counter
      // since this page last fetched it.
      trackEvent("demo-refresh", {
        counter: next.counter,
        lastAction: next.lastAction,
        previousCounter: prev.counter,
      });
      break;
  }
}

export default function App() {
  const [state, setState] = useState<AppState>({ counter: 0, lastAction: "none" });
  const [error, setError] = useState<string | null>(null);

  const run = async (action: Action, fn: () => Promise<AppState>) => {
    // Captured before the request: what the user saw when they acted.
    const prev = state;
    try {
      setError(null);
      const next = await fn();
      setState(next);
      trackSuccess(action, prev, next);
    } catch (e) {
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      // Non-2xx response or network/CORS error. One event for every action, so
      // failure rates can be segmented by `action`.
      trackEvent("demo-action-failed", { action, errorMessage });
    }
  };

  useEffect(() => {
    run("load", api.getState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 480, margin: "4rem auto", textAlign: "center" }}>
      <h1>QAWolf Demo</h1>

      <p data-testid="counter-value" style={{ fontSize: "3rem", margin: "1rem 0" }}>
        {state.counter}
      </p>
      <p data-testid="last-action" style={{ color: "#666" }}>
        Last action: {state.lastAction}
      </p>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        <button data-testid="btn-increment" onClick={() => run("increment", api.increment)}>
          Increment
        </button>
        <button data-testid="btn-decrement" onClick={() => run("decrement", api.decrement)}>
          Decrement
        </button>
        <button data-testid="btn-reset" onClick={() => run("reset", api.reset)}>
          Reset
        </button>
        <button data-testid="btn-refresh" onClick={() => run("refresh", api.getState)}>
          Refresh
        </button>
      </div>

      {error && (
        <p data-testid="error" style={{ color: "crimson", marginTop: 16 }}>
          {error}
        </p>
      )}
    </main>
  );
}
