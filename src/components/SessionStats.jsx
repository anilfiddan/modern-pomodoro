function StatCard({ title, value, suffix = '' }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <p className="stat-value">
        {value}
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </p>
    </div>
  );
}

function SessionStats({ stats, labels }) {
  return (
    <div className="session-stats">
      <h2>{labels?.title ?? 'Günün Ritmi'}</h2>
      <div className="stat-grid">
        <StatCard
          title={labels?.focus ?? 'Odak Süresi'}
          value={stats.focusMinutes}
          suffix={labels?.minutesSuffix ?? 'dk'}
        />
        <StatCard
          title={labels?.break ?? 'Mola Süresi'}
          value={stats.breakMinutes}
          suffix={labels?.minutesSuffix ?? 'dk'}
        />
        <StatCard
          title={labels?.breaksTaken ?? 'Mola Sayısı'}
          value={stats.breaksTaken}
        />
      </div>
    </div>
  );
}

export default SessionStats;
