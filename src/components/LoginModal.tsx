import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      onClose();
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-dark)',
          border: '2px solid var(--neon-cyan)',
          borderRadius: '8px',
          padding: '40px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 0 30px rgba(0, 255, 249, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '28px',
            marginBottom: '30px',
            textAlign: 'center',
          }}
          className="neon-text"
        >
          Вход
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--neon-cyan)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '16px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--neon-cyan)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '16px',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px',
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                borderRadius: '4px',
                color: '#ff6b6b',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              className="cyber-button"
              style={{
                flex: 1,
                padding: '12px',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'transparent',
                border: '1px solid var(--neon-cyan)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
