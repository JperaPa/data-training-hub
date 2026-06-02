import React, { useState } from 'react';
import { approveRecommendation } from '../api';

export default function ApprovalModal({ open, onClose, recommendation }) {
  const [rationale, setRationale] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleApprove() {
    setLoading(true);
    try {
      // Use a fixed approver id or prompt user
      const approver = 'local_user';
      // The API wrapper will call cybersecurity:assess first
      await approveRecommendation({ id: recommendation, approver, rationale });
      alert('Recommendation approved and logged.');
      onClose();
    } catch (e) {
      alert('Approval failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 16, width: 600, borderRadius: 8 }}>
        <h3>Approve Recommendation</h3>
        <p><strong>Recommendation:</strong> {recommendation}</p>
        <label>Rationale (required)</label>
        <textarea value={rationale} onChange={e => setRationale(e.target.value)} style={{ width: '100%', height: 80 }} />
        <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button onClick={handleApprove} disabled={loading || !rationale.trim()}>Confirm Approve</button>
        </div>
      </div>
    </div>
  );
}