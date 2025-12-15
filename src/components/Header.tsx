import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
    { to: '/lessons', label: 'Уроки' },
    { to: '/about', label: 'О преподавателе' },
    { to: '/parents', label: 'Родителям' },
    { to: '/faq', label: 'Вопросы' },
    { to: '/works', label: 'Работы' },
    { to: '/blog', label: 'Блог' },
  ];

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
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
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="cyber-button header-login-btn"
            >
              Вход
            </button>
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
          <button
            onClick={() => {
              setIsLoginModalOpen(true);
              closeMenu();
            }}
            className="cyber-button mobile-menu-btn"
          >
            Вход
          </button>
        </div>
      </header>
    </>
  );
}
