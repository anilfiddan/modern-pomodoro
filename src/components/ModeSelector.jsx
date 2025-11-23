function ModeSelector({ modes, currentMode, onSelect }) {
  return (
    <nav className="mode-selector" aria-label="Pomodoro modları">
      {Object.entries(modes).map(([key, meta]) => {
        const isActive = key === currentMode;
        return (
          <button
            key={key}
            type="button"
            className={`mode-chip ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(key)}
          >
            {meta.label}
          </button>
        );
      })}
    </nav>
  );
}

export default ModeSelector;
