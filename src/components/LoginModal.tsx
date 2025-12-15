import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'reset';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setSuccess('Регистрация успешна! Теперь вы можете войти.');
      setTimeout(() => {
        switchMode('login');
      }, 2000);
    } catch (err: any) {
      if (err.message.includes('already registered')) {
        setError('Этот email уже зарегистрирован');
      } else {
        setError(err.message || 'Ошибка регистрации');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });

      if (error) throw error;

      setSuccess('Инструкции по восстановлению пароля отправлены на ваш email');
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === 'login') {
      handleLogin(e);
    } else if (mode === 'register') {
      handleRegister(e);
    } else {
      handleResetPassword(e);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'register':
        return 'Регистрация';
      case 'reset':
        return 'Восстановление пароля';
      default:
        return 'Вход';
    }
  };

  const getButtonText = () => {
    if (loading) {
      switch (mode) {
        case 'register':
          return 'Регистрация...';
        case 'reset':
          return 'Отправка...';
        default:
          return 'Вход...';
      }
    }
    switch (mode) {
      case 'register':
        return 'Зарегистрироваться';
      case 'reset':
        return 'Отправить';
      default:
        return 'Войти';
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid var(--neon-cyan)',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '16px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
  };

  const linkStyle = {
    color: 'var(--neon-cyan)',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    padding: 0,
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
          {getTitle()}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {mode !== 'reset' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={inputStyle}
              />
            </div>
          )}

          {mode === 'register' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Подтвердите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                style={inputStyle}
              />
            </div>
          )}

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

          {success && (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px',
                background: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid rgba(0, 255, 0, 0.3)',
                borderRadius: '4px',
                color: '#6bff6b',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
              }}
            >
              {success}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
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
              {getButtonText()}
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

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  style={linkStyle}
                >
                  Забыли пароль?
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  style={linkStyle}
                >
                  Нет аккаунта? Зарегистрироваться
                </button>
              </>
            )}

            {mode === 'register' && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={linkStyle}
              >
                Уже есть аккаунт? Войти
              </button>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={linkStyle}
              >
                Вернуться к входу
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
