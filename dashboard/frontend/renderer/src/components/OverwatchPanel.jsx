import React, { useState } from 'react';
import ApprovalModal from './ApprovalModal';

export default function OverwatchPanel({ review, history }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);

  const consolidated = review?.consolidated || {};
  const correctiveActions = consolidated.correctiveActions || [];

  function openApprove(action) {
    setSelectedRec(action);
    setModalOpen(true);
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h2>Overwatch Review</h2>
      <div>Compliance Score: <strong>{consolidated.complianceScore ?? 'n/a'}</strong></div>
      <div>Deviations: {(consolidated.deviations || []).join(', ') || 'None'}</div>

      <h4 style={{ marginTop: 12 }}>Corrective Actions</h4>
      <ul>
        {correctiveActions.length ? correctiveActions.map((c, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <div>{c}</div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => openApprove(c)}>Approve</button>
            </div>
          </li>
        )) : <li>No corrective actions</li>}
      </ul>

      <h4 style={{ marginTop: 12 }}>Recent Reviews</h4>
      <ul>
        {(history || []).slice(0,5).map((h, i) => <li key={i}>{h.timestamp} — score {h.consolidated?.complianceScore}</li>)}
      </ul>

      <ApprovalModal open={modalOpen} onClose={() => setModalOpen(false)} recommendation={selectedRec} />
    </div>
  );
}
