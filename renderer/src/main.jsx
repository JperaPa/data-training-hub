import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {
  useEffect(() => {
    window.api.ping().then(res => {
      console.log("IPC TEST:", res);
    });
  }, []);

  return (
    <div style={{ padding: 40, fontSize: 24 }}>
      IPC Test Running — check console
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
