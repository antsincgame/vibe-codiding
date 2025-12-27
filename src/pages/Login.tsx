import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log('=== Google Sign In Started ===');
    setError('');
    setLoading(true);

    try {
      const origin = window.location.origin;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      console.log('1. Origin:', origin);
      console.log('2. Supabase URL:', supabaseUrl);

      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/auth-exchange`;
      const redirectUrl = `${edgeFunctionUrl}?origin=${encodeURIComponent(origin)}`;

      console.log('3. Edge Function URL:', edgeFunctionUrl);
      console.log('4. Redirect URL:', redirectUrl);
      console.log('5. Calling supabase.auth.signInWithOAuth...');

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });

      console.log('6. OAuth Response Data:', data);
      console.log('7. OAuth Error:', authError);

      if (authError) {
        console.error('8. ERROR during OAuth:', authError);
        setError(`Ошибка Google авторизации: ${authError.message}`);
        setLoading(false);
        return;
      }

      console.log('9. OAuth successful, redirecting to Google...');
    } catch (err) {
      console.error('10. CAUGHT ERROR:', err);
      setError('Произошла ошибка при входе через Google');
      setLoading(false);
    }
  };

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
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              color: 'var(--neon-cyan)',
              fontSize: '16px',
              fontWeight: 600
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
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              color: 'var(--neon-pink)',
              fontSize: '16px',
              fontWeight: 600
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
              autoComplete="current-password"
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

        <div style={{
          margin: '25px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(0, 255, 249, 0.3)' }} />
          <span style={{ opacity: 0.6, fontSize: '14px' }}>или</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(0, 255, 249, 0.3)' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="cyber-button"
          style={{
            width: '100%',
            borderColor: 'var(--neon-green)',
            color: 'var(--neon-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="currentColor" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="currentColor" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="currentColor" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="currentColor" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          {loading ? 'Вход через Google...' : 'Войти через Google'}
        </button>
      </div>
    </div>
  );
}
