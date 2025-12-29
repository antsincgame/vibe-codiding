import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('Неверная ссылка для сброса пароля. Запросите новую ссылку.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(token!, email!, password);

      if (result.error) {
        if (result.error.message.includes('invalid_token') || result.error.message.includes('Invalid')) {
          setError('Ссылка недействительна. Запросите новую ссылку для сброса пароля.');
        } else if (result.error.message.includes('token_expired') || result.error.message.includes('expired')) {
          setError('Срок действия ссылки истек. Запросите новую ссылку для сброса пароля.');
        } else {
          setError(result.error.message);
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '60px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div className="cyber-card" style={{ padding: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 30px',
              borderRadius: '50%',
              background: 'rgba(255, 0, 110, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--neon-pink)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 style={{ color: 'var(--neon-pink)', marginBottom: '20px' }}>Ошибка</h2>
            <p style={{ marginBottom: '30px', opacity: 0.8 }}>{error}</p>
            <Link to="/student/forgot-password" className="cyber-button" style={{ display: 'inline-block' }}>
              ЗАПРОСИТЬ НОВУЮ ССЫЛКУ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '60px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div className="cyber-card" style={{ padding: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 30px',
              borderRadius: '50%',
              background: 'rgba(0, 255, 100, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00ff64" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ color: '#00ff64', marginBottom: '20px' }}>Пароль изменен!</h2>
            <p style={{ marginBottom: '30px', opacity: 0.8 }}>
              Ваш пароль успешно обновлен. Теперь вы можете войти с новым паролем.
            </p>
            <Link to="/student/login" className="cyber-button" style={{ display: 'inline-block' }}>
              ВОЙТИ В АККАУНТ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 40px)',
          textAlign: 'center',
          marginBottom: '20px'
        }} className="glitch" data-text="НОВЫЙ ПАРОЛЬ">
          <span className="neon-text">НОВЫЙ ПАРОЛЬ</span>
        </h1>

        <p style={{
          textAlign: 'center',
          fontSize: '16px',
          opacity: 0.8,
          marginBottom: '40px'
        }}>
          Придумайте новый пароль для вашего аккаунта
        </p>

        <div className="cyber-card" style={{ padding: '40px' }}>
          <div style={{
            marginBottom: '30px',
            padding: '15px',
            background: 'rgba(0, 255, 249, 0.1)',
            border: '1px solid rgba(0, 255, 249, 0.3)',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>Email</div>
            <div style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>{decodeURIComponent(email)}</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label htmlFor="password" style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '16px',
                color: 'var(--neon-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600
              }}>
                Новый пароль *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="cyber-input"
                placeholder="Минимум 6 символов"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label htmlFor="confirmPassword" style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '16px',
                color: 'var(--neon-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600
              }}>
                Подтвердите пароль *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="cyber-input"
                placeholder="Повторите пароль"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: 'rgba(255, 0, 110, 0.1)',
                border: '1px solid var(--neon-pink)',
                borderRadius: '4px',
                color: 'var(--neon-pink)',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="cyber-button"
              style={{
                width: '100%',
                fontSize: '18px',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ ПАРОЛЬ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
