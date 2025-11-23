function Controls({ isRunning, onToggle, onReset }) {
  return (
    <div className="controls">
      <button type="button" className="primary" onClick={onToggle}>
        {isRunning ? 'Duraklat' : 'Başlat'}
      </button>
      <button type="button" className="ghost" onClick={onReset}>
        Sıfırla
      </button>
    </div>
  );
}

export default Controls;
