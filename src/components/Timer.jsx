const radius = 110;
const strokeWidth = 12;
const circumference = 2 * Math.PI * radius;

function Timer({ label, formattedTime, progress, isRunning }) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const dashOffset = circumference * (1 - safeProgress);

  return (
    <div className="timer" role="timer" aria-live="polite">
      <div className="timer-graphic" aria-hidden>
        <svg
          width="260"
          height="260"
          viewBox="0 0 260 260"
          className="timer-ring"
        >
          <circle
            className="timer-ring__track"
            cx="130"
            cy="130"
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="timer-ring__progress"
            cx="130"
            cy="130"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="timer-display">
          <p className="timer-label">{label}</p>
          <p className="timer-value">{formattedTime}</p>
          <p className="timer-status">{isRunning ? 'Çalışıyor' : 'Beklemede'}</p>
        </div>
      </div>
    </div>
  );
}

export default Timer;
