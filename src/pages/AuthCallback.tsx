import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Авторизация...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const hashParams = window.location.hash;

      if (code) {
        setStatus('Обработка авторизации...');
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Code exchange error:', error);
            setStatus('Ошибка авторизации');
            setTimeout(() => navigate('/student/login', { replace: true }), 1500);
            return;
          }
          if (data.session) {
            setStatus('Успешно! Перенаправление...');
            window.history.replaceState(null, '', '/auth/callback');
            setTimeout(() => {
              window.location.href = '/student/dashboard';
            }, 500);
            return;
          }
        } catch (err) {
          console.error('Callback error:', err);
          setStatus('Ошибка');
          setTimeout(() => navigate('/student/login', { replace: true }), 1500);
          return;
        }
      }

      if (hashParams.includes('access_token')) {
        setStatus('Проверка сессии...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('Успешно! Перенаправление...');
          setTimeout(() => {
            window.location.href = '/student/dashboard';
          }, 500);
          return;
        }
      }

      setStatus('Сессия не найдена');
      setTimeout(() => navigate('/student/login', { replace: true }), 1500);
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ fontSize: '24px', color: 'var(--neon-cyan)' }}>
        {status}
      </div>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(0, 255, 249, 0.3)',
        borderTop: '3px solid var(--neon-cyan)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
