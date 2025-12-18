import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/about', label: 'О преподавателе' },
    { to: '/q-a', label: 'Вопросы и ответы' },
    { to: '/works', label: 'Работы' },
    { to: '/blog', label: 'Блог' },
  ];

  return (
    <>
      <header className="site-header">
        <nav className="header-nav">
          <Link to="/" className="header-logo">
            <span className="neon-text glitch" data-text="VIBECODING">
              VIBECODING
            </span>
          </Link>

          <button
            className={`burger-button ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>

          <div className="nav-links-desktop">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMenu} />
        )}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="mobile-menu-link"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>
    </>
  );
}
