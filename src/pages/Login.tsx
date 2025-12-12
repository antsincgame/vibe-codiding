import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      navigate('/admin');
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="cyber-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{
          fontSize: '32px',
          marginBottom: '30px',
          textAlign: 'center',
          color: 'var(--neon-cyan)'
        }}>
          Вход в админ-панель
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: 'var(--neon-pink)'
            }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="cyber-input"
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div style={{
              color: 'var(--neon-pink)',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="cyber-button" style={{ width: '100%' }}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
