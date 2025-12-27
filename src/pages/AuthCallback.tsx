import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Авторизация...');
  const processedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);

    const errorParam = hashParams.get('error') || queryParams.get('error');
    const errorDesc = hashParams.get('error_description') || queryParams.get('error_description');
    const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
    const code = queryParams.get('code');

    console.log('AuthCallback: hash params:', Object.fromEntries(hashParams));
    console.log('AuthCallback: query params:', Object.fromEntries(queryParams));
    console.log('AuthCallback: accessToken:', accessToken ? 'present' : 'absent');
    console.log('AuthCallback: refreshToken:', refreshToken ? 'present' : 'absent');
    console.log('AuthCallback: code:', code ? 'present' : 'absent');

    if (errorParam) {
      setStatus(`Ошибка: ${errorDesc || errorParam}`);
      timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 2000);
      return;
    }

    let cleanup: (() => void) | null = null;

    const waitForProfile = async (userId: string, maxAttempts = 10): Promise<boolean> => {
      for (let i = 0; i < maxAttempts; i++) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (profile) {
          console.log('Profile found after', i + 1, 'attempts');
          return true;
        }

        console.log('Waiting for profile creation, attempt', i + 1);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return false;
    };

    const handleAuth = async () => {
      if (processedRef.current) return;

      if (code) {
        try {
          processedRef.current = true;
          console.log('AuthCallback: Exchanging code for session (PKCE flow)');
          setStatus('Обмен кода на сессию...');

          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('AuthCallback: Exchange error:', exchangeError);
            throw exchangeError;
          }

          console.log('AuthCallback: Session obtained:', data.session?.user?.email);

          if (data.session?.user) {
            setStatus('Создание профиля...');
            const profileExists = await waitForProfile(data.session.user.id);

            if (!profileExists) {
              console.error('Profile was not created in time');
              setStatus('Ошибка создания профиля');
              timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
              return;
            }

            window.history.replaceState(null, '', '/auth/callback');
            setStatus('Успешно! Перенаправление...');
            timeoutRef.current = setTimeout(() => {
              navigate('/student/dashboard', { replace: true });
            }, 500);
          }
        } catch (err) {
          console.error('Error exchanging code:', err);
          setStatus('Ошибка авторизации');
          timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
        }
        return;
      }

      if (accessToken && refreshToken) {
        try {
          processedRef.current = true;
          console.log('AuthCallback: Setting session with tokens from URL');
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) {
            throw setSessionError;
          }

          console.log('AuthCallback: Session set successfully, verifying...');
          const { data: { session: verifySession } } = await supabase.auth.getSession();
          console.log('AuthCallback: Session verified:', verifySession?.user?.email);

          if (verifySession?.user) {
            setStatus('Создание профиля...');
            const profileExists = await waitForProfile(verifySession.user.id);

            if (!profileExists) {
              console.error('Profile was not created in time');
              setStatus('Ошибка создания профиля');
              timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
              return;
            }
          }

          window.history.replaceState(null, '', '/auth/callback');
          setStatus('Успешно! Перенаправление...');
          timeoutRef.current = setTimeout(() => {
            navigate('/student/dashboard', { replace: true });
          }, 500);
        } catch (err) {
          console.error('Error setting session:', err);
          setStatus('Ошибка авторизации');
          timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
        }
        return;
      }

      console.log('AuthCallback: No tokens/code in URL, checking existing session and waiting...');

      const { data: { session: existingSession } } = await supabase.auth.getSession();
      console.log('AuthCallback: Existing session:', existingSession?.user?.email);

      if (existingSession?.user) {
        processedRef.current = true;
        setStatus('Создание профиля...');
        const profileExists = await waitForProfile(existingSession.user.id);

        if (!profileExists) {
          console.error('Profile was not created in time');
          setStatus('Ошибка создания профиля');
          timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
          return;
        }

        window.history.replaceState(null, '', '/auth/callback');
        setStatus('Успешно! Перенаправление...');
        timeoutRef.current = setTimeout(() => {
          navigate('/student/dashboard', { replace: true });
        }, 300);
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('AuthCallback: Auth event:', event, 'user:', session?.user?.email);

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !processedRef.current) {
          processedRef.current = true;

          setStatus('Создание профиля...');
          const profileExists = await waitForProfile(session.user.id);

          if (!profileExists) {
            console.error('Profile was not created in time');
            setStatus('Ошибка создания профиля');
            timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
            return;
          }

          window.history.replaceState(null, '', '/auth/callback');
          setStatus('Успешно! Перенаправление...');
          timeoutRef.current = setTimeout(() => {
            navigate('/student/dashboard', { replace: true });
          }, 300);
        }
      });

      cleanup = () => subscription.unsubscribe();

      timeoutRef.current = setTimeout(() => {
        if (!processedRef.current) {
          console.log('AuthCallback: Timeout - session not found');
          setStatus('Сессия не найдена');
          timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
        }
      }, 8000);
    };

    handleAuth();

    return () => {
      if (cleanup) cleanup();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
