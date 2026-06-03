import { useState } from "react";

export default function RepoSyncPanel() {
  const [output, setOutput] = useState("");

  async function call(endpoint, body) {
    try {
      const res = await fetch(`http://localhost:3000/git/${endpoint}`, {
        method: body ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
      });

      const text = await res.text();
      setOutput(text);
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Repo Sync Panel</h2>

      <button onClick={() => call("status")}>Check Status</button>
      <button onClick={() => call("pull")}>Pull Latest</button>
      <button onClick={() => call("add")}>Stage Changes</button>
      <button onClick={() => call("commit", { message: "Commit from UI" })}>
        Commit
      </button>
      <button onClick={() => call("push")}>Push</button>
      <button onClick={() => call("sync")}>Full Sync</button>

      <pre
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#111",
          color: "#0f0",
          minHeight: "150px"
        }}
      >
        {output}
      </pre>
    </div>
  );
}
