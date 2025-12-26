import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Авторизация...');
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const hashParams = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error') || new URLSearchParams(hashParams.substring(1)).get('error');
    const errorDesc = urlParams.get('error_description') || new URLSearchParams(hashParams.substring(1)).get('error_description');

    console.log('AuthCallback - hash:', hashParams);
    console.log('AuthCallback - error:', errorParam, errorDesc);

    if (errorParam) {
      setStatus(`Ошибка: ${errorDesc || errorParam}`);
      setTimeout(() => navigate('/student/login', { replace: true }), 2000);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthCallback - auth event:', event, session?.user?.email);

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        if (processedRef.current) return;
        processedRef.current = true;
        setStatus('Успешно! Перенаправление...');
        window.history.replaceState(null, '', '/auth/callback');
        setTimeout(() => {
          window.location.href = '/student/dashboard';
        }, 300);
      }
    });

    const checkSession = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session check:', session?.user?.email);

      if (session) {
        if (processedRef.current) return;
        processedRef.current = true;
        setStatus('Сессия найдена! Перенаправление...');
        window.history.replaceState(null, '', '/auth/callback');
        setTimeout(() => {
          window.location.href = '/student/dashboard';
        }, 300);
        return;
      }

      setTimeout(() => {
        if (!processedRef.current) {
          setStatus('Сессия не найдена. Попробуйте снова.');
          setTimeout(() => navigate('/student/login', { replace: true }), 1500);
        }
      }, 3000);
    };

    checkSession();

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
