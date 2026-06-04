import { useEffect, useState } from 'react';

export default function LogsDashboard() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [logs, setLogs] = useState({
    transcript: '',
    session: '',
    reflection: '',
    progress: '',
    sop: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/logs/dates')
      .then(res => res.json())
      .then(data => setDates(data));
  }, []);

  const loadLogs = (date) => {
    setSelectedDate(date);

    fetch(`http://localhost:3000/api/logs/${date}`)
      .then(res => res.json())
      .then(data => setLogs(data));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📊 DTH Logs Dashboard</h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h2>📅 Available Dates</h2>
          <ul>
            {dates.map(d => (
              <li key={d}>
                <button onClick={() => loadLogs(d)}>
                  {d}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selectedDate && (
          <div style={{ flex: 1 }}>
            <h2>🗂 Logs for {selectedDate}</h2>

            <section>
              <h3>📝 Transcript</h3>
              <pre>{logs.transcript || 'No transcript'}</pre>
            </section>

            <section>
              <h3>📄 Session Summary</h3>
              <pre>{logs.session || 'No session summary'}</pre>
            </section>

            <section>
              <h3>🧠 Reflection</h3>
              <pre>{logs.reflection || 'No reflection'}</pre>
            </section>

            <section>
              <h3>📊 Progress</h3>
              <pre>{JSON.stringify(logs.progress, null, 2) || 'No progress'}</pre>
            </section>

            <section>
              <h3>📏 SOP Compliance</h3>
              <pre>{logs.sop || 'No SOP report'}</pre>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
