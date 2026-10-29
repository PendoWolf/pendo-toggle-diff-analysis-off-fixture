import { useEffect, useState } from "react";
import { api, type AppState } from "./api";

// Seam for Pendo. Novus installs the Pendo agent, which provides window.pendo
// at runtime; this fires a Track Event for each action. No-op when the agent
// isn't present (local dev), so the app and Playwright mocks both stay simple.
function trackEvent(name: string) {
  if (typeof window !== "undefined") {
    window.pendo?.track?.(`demo-${name}`);
  }
}

export default function App() {
  const [state, setState] = useState<AppState>({ counter: 0, lastAction: "none" });
  const [error, setError] = useState<string | null>(null);

  const run = async (name: string, fn: () => Promise<AppState>) => {
    try {
      setError(null);
      setState(await fn());
      trackEvent(name);
    } catch (e) {
      setError((e as Error).message);
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
        <button data-testid="btn-qaw-1793311035332" onClick={() => run("qaw-1793311035332", api.increment)}>
          QAW 1793311035332
        </button>
        <button data-testid="btn-qaw-1793223333390" onClick={() => run("qaw-1793223333390", api.increment)}>
          QAW 1793223333390
        </button>
        <button data-testid="btn-qaw-1793137526608" onClick={() => run("qaw-1793137526608", api.increment)}>
          QAW 1793137526608
        </button>
        <button data-testid="btn-qaw-1793050266000" onClick={() => run("qaw-1793050266000", api.increment)}>
          QAW 1793050266000
        </button>
        <button data-testid="btn-qaw-1792790937385" onClick={() => run("qaw-1792790937385", api.increment)}>
          QAW 1792790937385
        </button>
        <button data-testid="btn-qaw-1792704980746" onClick={() => run("qaw-1792704980746", api.increment)}>
          QAW 1792704980746
        </button>
        <button data-testid="btn-qaw-1792618050475" onClick={() => run("qaw-1792618050475", api.increment)}>
          QAW 1792618050475
        </button>
        <button data-testid="btn-qaw-1792532017110" onClick={() => run("qaw-1792532017110", api.increment)}>
          QAW 1792532017110
        </button>
        <button data-testid="btn-qaw-1792445065173" onClick={() => run("qaw-1792445065173", api.increment)}>
          QAW 1792445065173
        </button>
        <button data-testid="btn-qaw-1792185869083" onClick={() => run("qaw-1792185869083", api.increment)}>
          QAW 1792185869083
        </button>
        <button data-testid="btn-qaw-1792099596384" onClick={() => run("qaw-1792099596384", api.increment)}>
          QAW 1792099596384
        </button>
        <button data-testid="btn-qaw-1792013435604" onClick={() => run("qaw-1792013435604", api.increment)}>
          QAW 1792013435604
        </button>
        <button data-testid="btn-qaw-1791926404268" onClick={() => run("qaw-1791926404268", api.increment)}>
          QAW 1791926404268
        </button>
        <button data-testid="btn-qaw-1791844957131" onClick={() => run("qaw-1791844957131", api.increment)}>
          QAW 1791844957131
        </button>
        <button data-testid="btn-qaw-1791844645710" onClick={() => run("qaw-1791844645710", api.increment)}>
          QAW 1791844645710
        </button>
        <button data-testid="btn-qaw-1791844150895" onClick={() => run("qaw-1791844150895", api.increment)}>
          QAW 1791844150895
        </button>
        <button data-testid="btn-qaw-1791512096539" onClick={() => run("qaw-1791512096539", api.increment)}>
          QAW 1791512096539
        </button>
        <button data-testid="btn-qaw-1791498793577" onClick={() => run("qaw-1791498793577", api.increment)}>
          QAW 1791498793577
        </button>
        <button data-testid="btn-qaw-1791494775412" onClick={() => run("qaw-1791494775412", api.increment)}>
          QAW 1791494775412
        </button>
        <button data-testid="btn-qaw-1791489009115" onClick={() => run("qaw-1791489009115", api.increment)}>
          QAW 1791489009115
        </button>
        <button data-testid="btn-qaw-1791486125245" onClick={() => run("qaw-1791486125245", api.increment)}>
          QAW 1791486125245
        </button>
                    <button data-testid="btn-divide" onClick={() => run("divide", api.decrement)}>
                      Divide
                    </button>
                    <button data-testid="btn-multiply" onClick={() => run("multiply", api.increment)}>
                      Multiply
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
