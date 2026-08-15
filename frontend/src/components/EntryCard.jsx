export default function EntryCard({ entry }) {
  if (entry.type === 'letter') {
    return (
      <div className="card entry-card letter">
        {entry.title && <h3>{entry.title}</h3>}
        <p className="letter-text">{entry.content}</p>
      </div>
    );
  }

  if (entry.type === 'phrase') {
    return (
      <div className="card entry-card phrase">
        <p className="phrase-text">"{entry.content}"</p>
      </div>
    );
  }

  if (entry.type === 'collage') {
    return (
      <div className="card entry-card collage">
        {entry.title && <h3>{entry.title}</h3>}
        <div className="collage-grid">
          {entry.images.map((src, i) => (
            <img key={i} src={src} alt={entry.title || 'foto'} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
