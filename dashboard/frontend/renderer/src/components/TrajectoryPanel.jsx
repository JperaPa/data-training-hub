import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function TrajectoryPanel({ trajectory }) {
  if (!trajectory) return <div style={{ border: '1px solid #ddd', padding: 12 }}>No trajectory data</div>;

  const prob = trajectory.forecast?.probabilityMissionOnTrack ?? 0;
  const shortReadiness = trajectory.indicators?.short?.readiness ?? 0;

  // small synthetic time series from recentProgressWindow if available
  const recent = (trajectory.recentProgressWindow || []).slice(-30);
  const labels = recent.map((r, i) => i + 1);
  const readinessSeries = recent.map(r => (r.ce && r.ce.readinessScore) || null);

  const data = {
    labels,
    datasets: [
      {
        label: 'Readiness',
        data: readinessSeries,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.2
      }
    ]
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h3>Trajectory</h3>
      <div>Probability Mission On Track: <strong>{(prob * 100).toFixed(1)}%</strong></div>
      <div>Short Readiness: <strong>{(shortReadiness * 100).toFixed(1)}%</strong></div>

      <div style={{ marginTop: 12 }}>
        <h4>Recent Readiness (last 30)</h4>
        <Line data={data} />
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Top Advice</h4>
        <ul>
          {(trajectory.forecast?.shortTermAdvice || []).slice(0,3).map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>
    </div>
  );
}
