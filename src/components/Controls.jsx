function Controls({ isRunning, onToggle, onReset, labels }) {
  return (
    <div className="controls">
      <button type="button" className="primary" onClick={onToggle}>
        {isRunning ? labels.pause : labels.start}
      </button>
      <button type="button" className="ghost" onClick={onReset}>
        {labels.reset}
      </button>
    </div>
  );
}

export default Controls;
