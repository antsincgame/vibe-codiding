import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials'
          ? 'Неверный email или пароль'
          : authError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Ошибка авторизации');
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        setError('Ошибка проверки прав доступа');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (!profile || profile.role !== 'admin') {
        setError('У вас нет прав администратора');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin');
    } catch (err) {
      setError('Произошла ошибка при входе');
      setLoading(false);
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
              color: 'var(--neon-cyan)'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="cyber-input"
              placeholder="admin@example.com"
              disabled={loading}
              required
            />
          </div>

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
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div style={{
              color: 'var(--neon-pink)',
              marginBottom: '20px',
              textAlign: 'center',
              padding: '10px',
              background: 'rgba(255, 0, 110, 0.1)',
              border: '1px solid var(--neon-pink)',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="cyber-button"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
