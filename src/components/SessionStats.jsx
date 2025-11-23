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

function SessionStats({ stats }) {
  return (
    <div className="session-stats">
      <h2>Günün Ritmi</h2>
      <div className="stat-grid">
        <StatCard title="Odak Süresi" value={stats.focusMinutes} suffix="dk" />
        <StatCard title="Mola Süresi" value={stats.breakMinutes} suffix="dk" />
        <StatCard title="Mola Sayısı" value={stats.breaksTaken} />
      </div>
    </div>
  );
}

export default SessionStats;
