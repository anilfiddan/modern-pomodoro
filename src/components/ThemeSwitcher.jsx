function ThemeSwitcher({ themes, currentTheme, onSelect }) {
  return (
    <section className="theme-switcher" aria-label="Tema Seçici">
      <div>
        <p className="eyebrow">Mood</p>
        <h2>Paletini Seç</h2>
      </div>
      <div className="theme-options">
        {Object.entries(themes).map(([key, meta]) => {
          const isActive = key === currentTheme;
          return (
            <button
              key={key}
              type="button"
              className={`theme-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(key)}
              style={{ '--chip-accent': meta.preview }}
            >
              <span className="theme-dot" />
              {meta.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ThemeSwitcher;
