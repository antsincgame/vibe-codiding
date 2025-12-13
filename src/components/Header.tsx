import { Link } from 'react-router-dom';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Главная' },
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

          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-link"
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
              className="cyber-button header-login-btn"
            >
              Вход
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
