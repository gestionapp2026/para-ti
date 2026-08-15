import { useState } from 'react';
import api from '../api.js';

const LEVEL_SIZE = 10;

function formatDate(iso) {
  return new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PointsPanel({ total, history, onChange }) {
  const [reason, setReason] = useState('');
  const [sending, setSending] = useState(false);

  const level = Math.floor(total / LEVEL_SIZE);
  const progressPct = (((total % LEVEL_SIZE) + LEVEL_SIZE) % LEVEL_SIZE) * (100 / LEVEL_SIZE);

  async function sendDelta(delta) {
    setSending(true);
    try {
      await api.post('/points', { delta, reason });
      setReason('');
      onChange();
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card points-panel">
      <h2>💘 Puntos de enamoramiento</h2>

      <div className="total-points">{total}</div>
      <div className="level-label">Nivel {level}</div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <input
        type="text"
        placeholder="Motivo (opcional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <div className="points-buttons">
        <button className="danger" disabled={sending} onClick={() => sendDelta(-1)}>
          − Bajar punto
        </button>
        <button disabled={sending} onClick={() => sendDelta(1)}>
          + Sumar punto
        </button>
      </div>

      <h3>Historial</h3>
      <ul className="history-list">
        {history.map((event) => (
          <li key={event._id} className={event.delta > 0 ? 'positive' : 'negative'}>
            <span>{event.delta > 0 ? `+${event.delta}` : event.delta}</span>
            <span className="history-reason">{event.reason || '—'}</span>
            <span className="history-date">{formatDate(event.createdAt)}</span>
          </li>
        ))}
        {history.length === 0 && <p className="muted">Sin movimientos todavia.</p>}
      </ul>
    </div>
  );
}
