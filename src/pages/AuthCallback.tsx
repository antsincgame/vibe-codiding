import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const hashParams = window.location.hash;

      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Code exchange error:', error);
            navigate('/student/login', { replace: true });
            return;
          }
          if (data.session) {
            navigate('/student/dashboard', { replace: true });
            return;
          }
        } catch (err) {
          console.error('Callback error:', err);
        }
      }

      if (hashParams.includes('access_token')) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/student/dashboard', { replace: true });
          return;
        }
      }

      navigate('/student/login', { replace: true });
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ fontSize: '24px', color: 'var(--neon-cyan)' }}>
        Авторизация...
      </div>
    </div>
  );
}
