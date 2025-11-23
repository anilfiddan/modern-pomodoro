import { useState } from 'react';

function LogEntry({ entry, modes, locale, copy }) {
  const modeLabel = modes[entry.mode]?.label ?? entry.mode;
  const timestamp = new Date(entry.timestamp);
  const timeString = timestamp.toLocaleTimeString(locale || 'tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="log-entry">
      <div>
        <p className="log-mode">
          {modeLabel}
          <span>
            {' '}
            ·
            {' '}
            {entry.minutes}
            {' '}
            {copy?.minutesSuffix ?? 'dk'}
          </span>
        </p>
        <p className="log-text">{entry.text}</p>
      </div>
      <span className="log-time">{timeString}</span>
    </div>
  );
}

function LogBook({ entries, onAddEntry, currentMode, modes, copy, locale }) {
  const [note, setNote] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const added = onAddEntry(note);
    if (added) {
      setNote('');
    }
  };

  return (
    <div className="logbook">
      <div className="logbook-header">
        <h2>{copy?.title ?? 'Notlar & Akış'}</h2>
        <p>
          {copy?.currentPrefix ?? 'Şu an:'}
          {' '}
          {modes[currentMode].label}
        </p>
      </div>
      <form className="log-form" onSubmit={handleSubmit}>
        <textarea
          placeholder={copy?.placeholder ?? 'Bu seansla ilgili kısa bir not bırak...'}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
        />
        <button type="submit">{copy?.button ?? 'Kaydet'}</button>
      </form>
      <div className="log-list" aria-live="polite">
        {entries.length === 0 ? (
          <p className="log-empty">
            {copy?.empty ?? 'Henüz not yok. İlk odak seansını kaydet!'}
          </p>
        ) : (
          entries.map((entry) => (
            <LogEntry
              key={entry.id}
              entry={entry}
              modes={modes}
              locale={locale}
              copy={copy}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default LogBook;
