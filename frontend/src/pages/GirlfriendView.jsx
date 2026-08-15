import { useEffect, useState, useCallback } from 'react';
import api from '../api.js';
import EntryCard from '../components/EntryCard.jsx';
import PointsPanel from '../components/PointsPanel.jsx';

export default function GirlfriendView() {
  const [entries, setEntries] = useState([]);
  const [points, setPoints] = useState({ total: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [needsCode, setNeedsCode] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setNeedsCode(false);
    try {
      const [entriesRes, pointsRes] = await Promise.all([api.get('/entries'), api.get('/points')]);
      setEntries(entriesRes.data.entries);
      setPoints(pointsRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setNeedsCode(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  function handleCodeSubmit(e) {
    e.preventDefault();
    localStorage.setItem('gf_code', codeInput);
    loadAll();
  }

  if (needsCode) {
    return (
      <div className="page center">
        <form className="card login-card" onSubmit={handleCodeSubmit}>
          <h1>💕 Hola</h1>
          <p className="muted">Escribe el codigo para ver tu sorpresa de hoy.</p>
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            autoFocus
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="gf-header">
        <h1>💖 Para ti, hoy</h1>
        <p className="muted">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </header>

      {loading ? (
        <p className="muted">Cargando...</p>
      ) : entries.length === 0 ? (
        <p className="muted">Todavia no hay nada publicado hoy... vuelve mas tarde 💌</p>
      ) : (
        <div className="entries-stack">
          {entries.map((entry) => (
            <EntryCard key={entry._id} entry={entry} />
          ))}
        </div>
      )}

      <PointsPanel total={points.total} history={points.history} onChange={loadAll} />
    </div>
  );
}
