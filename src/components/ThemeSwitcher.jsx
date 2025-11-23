function ThemeSwitcher({ themes, currentTheme, onSelect, eyebrow, title, labels }) {
  return (
    <section className="theme-switcher" aria-label={title}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
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
              {labels?.[key] ?? meta.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ThemeSwitcher;
