import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Авторизация...');
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthCallback - auth event:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        processedRef.current = true;
        setStatus('Успешно! Перенаправление...');
        window.history.replaceState(null, '', '/auth/callback');
        setTimeout(() => {
          window.location.href = '/student/dashboard';
        }, 300);
      }
    });

    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const hashParams = window.location.hash;
      const errorParam = urlParams.get('error');
      const errorDesc = urlParams.get('error_description');

      console.log('AuthCallback - code:', code);
      console.log('AuthCallback - hash:', hashParams);
      console.log('AuthCallback - error:', errorParam, errorDesc);

      if (errorParam) {
        setStatus(`Ошибка: ${errorDesc || errorParam}`);
        setTimeout(() => navigate('/student/login', { replace: true }), 2000);
        return;
      }

      if (code) {
        setStatus('Обработка авторизации...');
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          console.log('Exchange result:', { data, error });
          if (error) {
            console.error('Code exchange error:', error);
            setStatus('Ошибка авторизации');
            setTimeout(() => navigate('/student/login', { replace: true }), 1500);
            return;
          }
          if (data.session) {
            processedRef.current = true;
            setStatus('Успешно! Перенаправление...');
            window.history.replaceState(null, '', '/auth/callback');
            setTimeout(() => {
              window.location.href = '/student/dashboard';
            }, 300);
            return;
          }
        } catch (err) {
          console.error('Callback error:', err);
          setStatus('Ошибка');
          setTimeout(() => navigate('/student/login', { replace: true }), 1500);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session);

      if (session) {
        processedRef.current = true;
        setStatus('Сессия найдена! Перенаправление...');
        setTimeout(() => {
          window.location.href = '/student/dashboard';
        }, 300);
        return;
      }

      setTimeout(() => {
        if (!processedRef.current) {
          setStatus('Сессия не найдена');
          setTimeout(() => navigate('/student/login', { replace: true }), 1500);
        }
      }, 3000);
    };

    handleCallback();

    return () => {
      subscription.unsubscribe();
    };
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
