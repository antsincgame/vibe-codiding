import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { debugLog } from '../components/DebugPanel';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Авторизация...');
  const processedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    debugLog('CALLBACK', '=============================================', undefined, 'info');
    debugLog('CALLBACK', '=== AUTH CALLBACK PAGE LOADED ===', undefined, 'info');
    debugLog('CALLBACK', '=============================================', undefined, 'info');
    debugLog('CALLBACK', 'Full URL', window.location.href);
    debugLog('CALLBACK', 'Pathname', window.location.pathname);
    debugLog('CALLBACK', 'Search', window.location.search);
    debugLog('CALLBACK', 'Hash', window.location.hash);
    debugLog('CALLBACK', 'Hash length', window.location.hash.length);

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);

    debugLog('CALLBACK', 'Hash params (raw)', window.location.hash.substring(1));
    debugLog('CALLBACK', 'Query params (raw)', window.location.search);

    const errorParam = hashParams.get('error') || queryParams.get('error');
    const errorDesc = hashParams.get('error_description') || queryParams.get('error_description');
    const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
    const code = queryParams.get('code');
    const tokenType = hashParams.get('token_type') || queryParams.get('token_type');
    const expiresIn = hashParams.get('expires_in') || queryParams.get('expires_in');
    const expiresAt = hashParams.get('expires_at') || queryParams.get('expires_at');
    const providerToken = hashParams.get('provider_token') || queryParams.get('provider_token');

    debugLog('CALLBACK', 'Parsed params', {
      error: errorParam,
      errorDesc,
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length,
      hasRefreshToken: !!refreshToken,
      refreshTokenLength: refreshToken?.length,
      hasCode: !!code,
      codeLength: code?.length,
      tokenType,
      expiresIn,
      expiresAt,
      hasProviderToken: !!providerToken
    });

    if (accessToken) {
      debugLog('CALLBACK', 'Access token preview', accessToken.substring(0, 50) + '...');
    }

    if (code) {
      debugLog('CALLBACK', 'Code preview', code.substring(0, 20) + '...');
    }

    if (errorParam) {
      debugLog('CALLBACK', 'ERROR from OAuth provider', { error: errorParam, description: errorDesc }, 'error');
      setStatus(`Ошибка: ${errorDesc || errorParam}`);
      timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 2000);
      return;
    }

    let cleanup: (() => void) | null = null;

    const waitForProfile = async (userId: string, maxAttempts = 10): Promise<boolean> => {
      debugLog('CALLBACK', `Waiting for profile creation (user: ${userId})...`);
      for (let i = 0; i < maxAttempts; i++) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('id', userId)
          .maybeSingle();

        debugLog('CALLBACK', `Profile check attempt ${i + 1}/${maxAttempts}`, {
          found: !!profile,
          error: error?.message,
          profile
        });

        if (profile) {
          debugLog('CALLBACK', 'Profile found!', profile, 'success');
          return true;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }
      debugLog('CALLBACK', 'Profile NOT created after all attempts', undefined, 'error');
      return false;
    };

    const handleAuth = async () => {
      if (processedRef.current) {
        debugLog('CALLBACK', 'Already processed, skipping', undefined, 'warn');
        return;
      }

      const { data: { session: existingSession } } = await supabase.auth.getSession();

      if (existingSession?.user) {
        debugLog('CALLBACK', 'Session already exists (auto-exchanged by Supabase)', existingSession.user.email, 'success');
        processedRef.current = true;

        setStatus('Проверка профиля...');
        const profileExists = await waitForProfile(existingSession.user.id);

        if (!profileExists) {
          debugLog('CALLBACK', 'Profile creation failed', undefined, 'error');
          setStatus('Ошибка создания профиля');
          timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
          return;
        }

        window.history.replaceState(null, '', '/auth/callback');
        setStatus('Успешно! Перенаправление...');
        debugLog('CALLBACK', 'Redirecting to dashboard...', undefined, 'success');
        timeoutRef.current = setTimeout(() => {
          navigate('/student/dashboard', { replace: true });
        }, 300);
        return;
      }

      if (code) {
        debugLog('CALLBACK', '=== PKCE FLOW: Exchanging code for session ===', undefined, 'info');
        try {
          processedRef.current = true;
          setStatus('Обмен кода на сессию...');

          debugLog('CALLBACK', 'Calling exchangeCodeForSession with code...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          debugLog('CALLBACK', 'exchangeCodeForSession response', {
            hasData: !!data,
            hasSession: !!data?.session,
            hasUser: !!data?.session?.user,
            userEmail: data?.session?.user?.email,
            userId: data?.session?.user?.id,
            provider: data?.session?.user?.app_metadata?.provider,
            error: exchangeError?.message
          }, exchangeError ? 'error' : 'success');

          if (exchangeError) {
            debugLog('CALLBACK', 'Exchange ERROR', exchangeError, 'error');
            throw exchangeError;
          }

          if (data.session?.user) {
            debugLog('CALLBACK', 'Session obtained successfully!', data.session.user.email, 'success');

            setStatus('Создание профиля...');
            const profileExists = await waitForProfile(data.session.user.id);

            if (!profileExists) {
              debugLog('CALLBACK', 'Profile creation failed', undefined, 'error');
              setStatus('Ошибка создания профиля');
              timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
              return;
            }

            window.history.replaceState(null, '', '/auth/callback');
            setStatus('Успешно! Перенаправление...');
            debugLog('CALLBACK', 'Redirecting to dashboard...', undefined, 'success');
            timeoutRef.current = setTimeout(() => {
              navigate('/student/dashboard', { replace: true });
            }, 500);
          } else {
            debugLog('CALLBACK', 'No user in session after exchange', undefined, 'error');
          }
        } catch (err) {
          debugLog('CALLBACK', 'Exception in code exchange', err, 'error');
          setStatus('Ошибка авторизации');
          timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
        }
        return;
      }

      if (accessToken && refreshToken) {
        debugLog('CALLBACK', '=== IMPLICIT FLOW: Setting session with tokens ===', undefined, 'info');
        try {
          processedRef.current = true;

          debugLog('CALLBACK', 'Calling setSession with tokens...');
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          debugLog('CALLBACK', 'setSession response', {
            hasData: !!data,
            hasSession: !!data?.session,
            hasUser: !!data?.session?.user,
            userEmail: data?.session?.user?.email,
            error: setSessionError?.message
          }, setSessionError ? 'error' : 'success');

          if (setSessionError) {
            debugLog('CALLBACK', 'setSession ERROR', setSessionError, 'error');
            throw setSessionError;
          }

          debugLog('CALLBACK', 'Verifying session after setSession...');
          const { data: { session: verifySession }, error: verifyError } = await supabase.auth.getSession();

          debugLog('CALLBACK', 'Session verification', {
            hasSession: !!verifySession,
            userEmail: verifySession?.user?.email,
            error: verifyError?.message
          }, verifyError ? 'error' : 'success');

          if (verifySession?.user) {
            setStatus('Создание профиля...');
            const profileExists = await waitForProfile(verifySession.user.id);

            if (!profileExists) {
              debugLog('CALLBACK', 'Profile creation failed', undefined, 'error');
              setStatus('Ошибка создания профиля');
              timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
              return;
            }
          }

          window.history.replaceState(null, '', '/auth/callback');
          setStatus('Успешно! Перенаправление...');
          debugLog('CALLBACK', 'Redirecting to dashboard...', undefined, 'success');
          timeoutRef.current = setTimeout(() => {
            navigate('/student/dashboard', { replace: true });
          }, 500);
        } catch (err) {
          debugLog('CALLBACK', 'Exception in token handling', err, 'error');
          setStatus('Ошибка авторизации');
          timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
        }
        return;
      }

      debugLog('CALLBACK', '=== NO TOKENS/CODE IN URL, waiting for auth state ===', undefined, 'warn');

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        debugLog('CALLBACK', `onAuthStateChange in callback: ${event}`, {
          event,
          hasSession: !!session,
          userEmail: session?.user?.email
        }, event === 'SIGNED_IN' ? 'success' : 'info');

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !processedRef.current) {
          processedRef.current = true;
          debugLog('CALLBACK', 'User signed in via listener!', session.user.email, 'success');

          setStatus('Создание профиля...');
          const profileExists = await waitForProfile(session.user.id);

          if (!profileExists) {
            debugLog('CALLBACK', 'Profile creation failed', undefined, 'error');
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
          debugLog('CALLBACK', 'TIMEOUT: Session not found after 8 seconds', undefined, 'error');
          setStatus('Сессия не найдена');
          timeoutRef.current = setTimeout(() => navigate('/student/login', { replace: true }), 1500);
        }
      }, 8000);
    };

    handleAuth();

    return () => {
      debugLog('CALLBACK', 'Cleanup: removing listener and timeouts');
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
      gap: '20px',
      paddingBottom: '350px'
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
