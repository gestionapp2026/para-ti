import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { password });
      localStorage.setItem('admin_token', data.token);
      navigate('/admin');
    } catch (err) {
      setError('Contrasena incorrecta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page center">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1>💌 Panel del creador</h1>
        <p className="muted">Entra con tu contrasena para crear algo hoy.</p>
        <input
          type="password"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
