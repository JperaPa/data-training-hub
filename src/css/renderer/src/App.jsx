import React, { useEffect, useState } from 'react';
import { runReview, getTrajectory, getHistory } from './api';
import OverwatchPanel from './components/OverwatchPanel';
import TrajectoryPanel from './components/TrajectoryPanel';
import AgentCard from './components/AgentCard';

export default function App() {
  const [state, setState] = useState(null);
  const [review, setReview] = useState(null);
  const [trajectory, setTrajectory] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // initial load of trajectory and history
    (async () => {
      const t = await getTrajectory();
      setTrajectory(t);
      const h = await getHistory();
      setHistory(h || []);
    })();
  }, []);

  async function handleRunReview() {
    try {
      const res = await runReview();
      setReview(res);
      setTrajectory(res.trajectory || null);
      // append to history
      setHistory(prev => [res, ...(prev || [])]);
    } catch (e) {
      console.error(e);
      alert('Review failed: ' + e.message);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Data Training Hub — Overwatch</h1>
        <div>
          <button onClick={handleRunReview}>Run Overwatch Review</button>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 16, marginTop: 16 }}>
        <div>
          <OverwatchPanel review={review} history={history} />
          <div style={{ marginTop: 12 }}>
            <h3>Agents</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <AgentCard name="CE Agent" metricKey="readinessScore" />
              <AgentCard name="Finance Agent" metricKey="netCashFlow" />
              <AgentCard name="OSINT Agent" metricKey="detections" />
            </div>
          </div>
        </div>

        <aside>
          <TrajectoryPanel trajectory={trajectory} />
        </aside>
      </section>
    </div>
  );
}
