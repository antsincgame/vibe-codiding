import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile } = useAuth();

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
    { to: '/courses', label: 'Курсы' },
    { to: '/trial', label: 'Пробный урок' },
    { to: '/about', label: 'Преподаватели' },
    { to: '/q-a', label: 'FAQ' },
    { to: '/blog', label: 'Блог' },
    { to: '/history', label: 'История' },
  ];

  const isAdmin = profile?.role === 'admin';
  const isTeacher = profile?.role === 'teacher';
  const canAccessTeacherPanel = isAdmin || isTeacher;

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
            {canAccessTeacherPanel && (
              <Link to="/teacher" className="nav-link" style={{
                background: 'rgba(57, 255, 20, 0.1)',
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid var(--neon-green)'
              }}>
                Работы учеников
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="nav-link" style={{
                background: 'rgba(255, 87, 51, 0.1)',
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #ff5733'
              }}>
                Админка
              </Link>
            )}
            <a
              href="https://t.me/vibecodingby"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                borderRadius: '4px',
                color: '#0088cc',
                transition: 'transform 0.2s, opacity 0.2s'
              }}
              title="Telegram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.242-1.865-.442-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.325.016.093.036.305.02.47z"/>
              </svg>
            </a>
            {user ? (
              <Link to="/student/dashboard" className="nav-link" style={{
                background: 'rgba(0, 255, 249, 0.1)',
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid var(--neon-cyan)'
              }}>
                {profile?.full_name || 'Профиль'}
              </Link>
            ) : (
              <Link to="/student/login" className="nav-link" style={{
                background: 'rgba(0, 255, 249, 0.1)',
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid var(--neon-cyan)'
              }}>
                Вход
              </Link>
            )}
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
          {canAccessTeacherPanel && (
            <Link
              to="/teacher"
              className="mobile-menu-link"
              onClick={closeMenu}
              style={{
                background: 'rgba(57, 255, 20, 0.1)',
                border: '1px solid var(--neon-green)',
                marginTop: '10px'
              }}
            >
              Работы учеников
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="mobile-menu-link"
              onClick={closeMenu}
              style={{
                background: 'rgba(255, 87, 51, 0.1)',
                border: '1px solid #ff5733',
                marginTop: '10px'
              }}
            >
              Админка
            </Link>
          )}
          {user ? (
            <Link
              to="/student/dashboard"
              className="mobile-menu-link"
              onClick={closeMenu}
              style={{
                background: 'rgba(0, 255, 249, 0.1)',
                border: '1px solid var(--neon-cyan)',
                marginTop: '10px'
              }}
            >
              {profile?.full_name || 'Профиль'}
            </Link>
          ) : (
            <Link
              to="/student/login"
              className="mobile-menu-link"
              onClick={closeMenu}
              style={{
                background: 'rgba(0, 255, 249, 0.1)',
                border: '1px solid var(--neon-cyan)',
                marginTop: '10px'
              }}
            >
              Вход
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
