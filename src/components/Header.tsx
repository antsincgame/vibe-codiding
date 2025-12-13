import { Link } from 'react-router-dom';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 15, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--neon-cyan)',
      boxShadow: '0 0 20px rgba(0, 255, 249, 0.3)'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <Link to="/" style={{
          fontSize: '24px',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 900,
          textDecoration: 'none'
        }}>
          <span className="neon-text glitch" data-text="VIBECODING">
            VIBECODING
          </span>
        </Link>
        
        <div style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Главная
          </Link>
          <Link to="/about" style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            О преподавателе
          </Link>
          <Link to="/parents" style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Родителям
          </Link>
          <Link to="/faq" style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Вопросы
          </Link>
          <Link to="/works" style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Работы
          </Link>
          <Link to="/blog" style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Блог
          </Link>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="cyber-button"
            style={{
              padding: '8px 20px',
              fontSize: '14px'
            }}
          >
            Вход
          </button>
        </div>
      </nav>
    </header>
    </>
  );
}
