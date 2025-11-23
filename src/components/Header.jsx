function Header({ eyebrow, title, badge }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {badge && <span className="badge">{badge}</span>}
    </header>
  );
}

export default Header;
