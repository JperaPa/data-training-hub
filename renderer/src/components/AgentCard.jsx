import React from 'react';

export default function AgentCard({ name, metricKey }) {
  // In a full implementation, fetch agent metrics via get-system-state IPC
  return (
    <div style={{ border: '1px solid #eee', padding: 8, width: 200, borderRadius: 6 }}>
      <strong>{name}</strong>
      <div style={{ marginTop: 8 }}>Metric: {metricKey}</div>
      <div style={{ marginTop: 8 }}>
        <button disabled>Details</button>
      </div>
    </div>
  );
}
