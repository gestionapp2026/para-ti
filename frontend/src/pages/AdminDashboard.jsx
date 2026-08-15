import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const TYPE_LABELS = {
  letter: '💌 Carta',
  phrase: '✨ Frase',
  collage: '🖼️ Collage de fotos',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [type, setType] = useState('letter');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [date, setDate] = useState(today);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  async function loadEntries() {
    setLoadingList(true);
    try {
      const { data } = await api.get('/entries/all');
      setEntries(data.entries);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }

  async function handleImagesChange(e) {
    const files = Array.from(e.target.files || []).slice(0, 10);
    const base64s = await Promise.all(files.map(fileToBase64));
    setImages(base64s);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      await api.post('/entries', {
        type,
        title,
        content,
        images: type === 'collage' ? images : [],
        date,
      });
      setMessage('Guardado ✅');
      setTitle('');
      setContent('');
      setImages([]);
      loadEntries();
    } catch (err) {
      setMessage('Ocurrio un error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Borrar esta entrada?')) return;
    await api.delete(`/entries/${id}`);
    loadEntries();
  }

  return (
    <div className="page">
      <header className="admin-header">
        <h1>💌 Crear algo para hoy</h1>
        <button className="secondary" onClick={logout}>
          Salir
        </button>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <label>
          Tipo
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="letter">Carta</option>
            <option value="phrase">Frase</option>
            <option value="collage">Collage de fotos</option>
          </select>
        </label>

        <label>
          Fecha
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <label>
          Titulo (opcional)
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Un titulo bonito"
          />
        </label>

        {type !== 'collage' && (
          <label>
            {type === 'letter' ? 'Tu carta' : 'La frase'}
            <textarea
              rows={type === 'letter' ? 8 : 3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'letter' ? 'Escribe lo que sientes...' : 'Una frase corta y bonita'}
              required
            />
          </label>
        )}

        {type === 'collage' && (
          <label>
            Fotos (varias)
            <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
            {images.length > 0 && (
              <div className="thumbs">
                {images.map((src, i) => (
                  <img key={i} src={src} alt="preview" />
                ))}
              </div>
            )}
          </label>
        )}

        {message && <p className="muted">{message}</p>}
        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Publicar'}
        </button>
      </form>

      <h2>Todo lo publicado</h2>
      {loadingList ? (
        <p className="muted">Cargando...</p>
      ) : (
        <ul className="entry-list">
          {entries.map((entry) => (
            <li key={entry._id} className="entry-row">
              <div>
                <strong>{TYPE_LABELS[entry.type]}</strong>{' '}
                <span className="muted">{entry.date}</span>
                {entry.title && <div>{entry.title}</div>}
              </div>
              <button className="danger" onClick={() => handleDelete(entry._id)}>
                Borrar
              </button>
            </li>
          ))}
          {entries.length === 0 && <p className="muted">Aun no has publicado nada.</p>}
        </ul>
      )}
    </div>
  );
}
