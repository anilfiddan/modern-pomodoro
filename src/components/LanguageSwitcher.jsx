function LanguageSwitcher({ label, options, currentLanguage, onSelect }) {
  return (
    <div className="language-switcher" aria-label={label}>
      <p className="language-label">{label}</p>
      <div className="language-options">
        {Object.entries(options).map(([key, value]) => (
          <button
            key={key}
            type="button"
            className={`language-chip ${currentLanguage === key ? 'active' : ''}`}
            onClick={() => onSelect(key)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
