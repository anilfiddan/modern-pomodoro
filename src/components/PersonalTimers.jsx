import { useState } from 'react';

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0');
  const secs = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

function PersonalTimerCard({ timer, labels, controls, onToggle, onReset }) {
  return (
    <div
      className="personal-timer-card"
      style={{ borderColor: timer.color, boxShadow: `0 12px 30px ${timer.color}22` }}
    >
      <div className="personal-timer-card__meta">
        <div>
          <p className="personal-timer__label" style={{ color: timer.color }}>
            {timer.name}
          </p>
          <p className="personal-timer__duration">
            {labels?.durationPrefix ?? 'Toplam:'}
            {' '}
            {Math.round(timer.duration / 60)}
            {' '}
            {labels?.minutesSuffix ?? 'dk'}
          </p>
        </div>
        <span className="personal-timer__dot" style={{ backgroundColor: timer.color }} />
      </div>
      <p className="personal-timer__time">{formatTime(timer.timeLeft)}</p>
      <p className="personal-timer__status">
        {timer.isRunning ? labels?.running ?? 'Aktif' : labels?.idle ?? 'Hazır'}
      </p>
      <div className="personal-timer-card__actions">
        <button
          type="button"
          className="primary"
          onClick={() => onToggle(timer.id)}
        >
          {timer.isRunning ? controls.pause : controls.start}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => onReset(timer.id)}
        >
          {controls.reset}
        </button>
      </div>
    </div>
  );
}

function PersonalTimers({ timers, labels, controls, onAdd, onToggle, onReset }) {
  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState(25);
  const [color, setColor] = useState('#111827');

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsedMinutes = Number(minutes);
    const safeMinutes = Number.isFinite(parsedMinutes) && parsedMinutes > 0
      ? parsedMinutes
      : 1;
    onAdd({
      name: name.trim() || labels?.defaultName || 'Yeni Sayaç',
      minutes: safeMinutes,
      color,
    });
    setName('');
  };

  return (
    <section className="personal-timers">
      <div className="personal-timers__header">
        <div>
          <p className="eyebrow">{labels?.eyebrow ?? 'Takım'}</p>
          <h2>{labels?.title ?? 'Kişisel Sayaçlar'}</h2>
        </div>
        <form className="personal-timers__form" onSubmit={handleSubmit}>
          <label>
            <span>{labels?.nameLabel ?? 'İsim'}</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={labels?.namePlaceholder ?? 'Örn. Ayşe'}
            />
          </label>
          <label>
            <span>{labels?.minutesLabel ?? 'Süre (dk)'}</span>
            <input
              type="number"
              min="1"
              value={minutes}
              onChange={(event) => setMinutes(event.target.value)}
            />
          </label>
          <label className="personal-timers__color">
            <span>{labels?.colorLabel ?? 'Renk'}</span>
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              aria-label={labels?.colorLabel ?? 'Renk'}
            />
          </label>
          <button type="submit" className="primary">
            {labels?.addButton ?? 'Sayaç Ekle'}
          </button>
        </form>
      </div>
      {timers.length === 0 ? (
        <p className="personal-timers__empty">
          {labels?.empty ?? 'Henüz sayaç yok. Yeni bir sayaç ekleyin.'}
        </p>
      ) : (
        <div className="personal-timers__grid">
          {timers.map((timer) => (
            <PersonalTimerCard
              key={timer.id}
              timer={timer}
              labels={labels}
              controls={controls}
              onToggle={onToggle}
              onReset={onReset}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PersonalTimers;
