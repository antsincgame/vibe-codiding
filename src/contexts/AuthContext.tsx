import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { debugLog } from '../components/DebugPanel';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    debugLog('AUTH', '=== AUTH PROVIDER INIT ===', undefined, 'info');
    debugLog('AUTH', 'Supabase URL', import.meta.env.VITE_SUPABASE_URL);
    debugLog('AUTH', 'Current URL', window.location.href);
    debugLog('AUTH', 'Origin', window.location.origin);

    const initAuth = async () => {
      debugLog('AUTH', 'initAuth() starting...');

      try {
        debugLog('AUTH', 'Calling supabase.auth.getSession()...');
        const { data, error } = await supabase.auth.getSession();

        debugLog('AUTH', 'getSession() response', {
          hasSession: !!data.session,
          hasUser: !!data.session?.user,
          userEmail: data.session?.user?.email,
          expiresAt: data.session?.expires_at,
          error: error?.message
        });

        if (error) {
          debugLog('AUTH', 'getSession ERROR', error.message, 'error');
        }

        if (mounted) {
          if (data.session?.user) {
            debugLog('AUTH', 'Session found, setting user', data.session.user.email, 'success');
            setUser(data.session.user);
            await loadProfile(data.session.user.id);
          } else {
            debugLog('AUTH', 'No session found', undefined, 'warn');
            setUser(null);
            setLoading(false);
          }
        }
      } catch (err) {
        debugLog('AUTH', 'initAuth() EXCEPTION', err, 'error');
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    debugLog('AUTH', 'Setting up onAuthStateChange listener...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) {
        debugLog('AUTH', 'onAuthStateChange called but component unmounted', event, 'warn');
        return;
      }

      debugLog('AUTH', `onAuthStateChange: ${event}`, {
        event,
        hasSession: !!session,
        userEmail: session?.user?.email,
        userId: session?.user?.id,
        provider: session?.user?.app_metadata?.provider,
        accessToken: session?.access_token ? `${session.access_token.substring(0, 20)}...` : null
      }, event === 'SIGNED_IN' ? 'success' : 'info');

      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          debugLog('AUTH', 'User present, loading profile...', session.user.email);
          await loadProfile(session.user.id);
        } else {
          debugLog('AUTH', 'No user in session', undefined, 'warn');
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => {
      debugLog('AUTH', 'Cleanup: unsubscribing');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string, retries = 5) => {
    debugLog('PROFILE', `Loading profile for ${userId}...`);

    for (let i = 0; i < retries; i++) {
      try {
        debugLog('PROFILE', `Attempt ${i + 1}/${retries}`);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          debugLog('PROFILE', `Query error`, error.message, 'error');
          throw error;
        }

        if (data) {
          debugLog('PROFILE', 'Profile loaded', { email: data.email, role: data.role }, 'success');
          setProfile(data);
          setLoading(false);
          return;
        }

        debugLog('PROFILE', `Not found, waiting 500ms...`, undefined, 'warn');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        debugLog('PROFILE', 'Exception in loadProfile', error, 'error');
      }
    }

    debugLog('PROFILE', 'Profile NOT FOUND after all retries', undefined, 'error');
    setProfile(null);
    setLoading(false);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    debugLog('SIGNUP', `Starting signup for ${email}...`);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/student/confirm`
        }
      });
      debugLog('SIGNUP', error ? 'Signup error' : 'Signup success', error?.message, error ? 'error' : 'success');
      return { error };
    } catch (error) {
      debugLog('SIGNUP', 'Signup exception', error, 'error');
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    debugLog('SIGNIN', `Starting signin for ${email}...`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      debugLog('SIGNIN', error ? 'Signin error' : 'Signin success', {
        error: error?.message,
        userId: data.user?.id
      }, error ? 'error' : 'success');
      return { error };
    } catch (error) {
      debugLog('SIGNIN', 'Signin exception', error, 'error');
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/auth/callback`;

    debugLog('GOOGLE', '========================================', undefined, 'info');
    debugLog('GOOGLE', '=== GOOGLE SIGN IN STARTING ===', undefined, 'info');
    debugLog('GOOGLE', '========================================', undefined, 'info');
    debugLog('GOOGLE', 'Current location', window.location.href);
    debugLog('GOOGLE', 'Origin', window.location.origin);
    debugLog('GOOGLE', 'Redirect URL', redirectUrl);
    debugLog('GOOGLE', 'Supabase URL', import.meta.env.VITE_SUPABASE_URL);

    try {
      debugLog('GOOGLE', 'Calling supabase.auth.signInWithOAuth...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });

      debugLog('GOOGLE', 'signInWithOAuth response', {
        hasData: !!data,
        url: data?.url,
        provider: data?.provider,
        error: error?.message
      }, error ? 'error' : 'success');

      if (error) {
        debugLog('GOOGLE', 'OAuth ERROR', error, 'error');
        return { error };
      }

      if (data?.url) {
        debugLog('GOOGLE', 'Redirecting to Google...', data.url, 'success');
        debugLog('GOOGLE', 'URL breakdown', {
          protocol: new URL(data.url).protocol,
          host: new URL(data.url).host,
          pathname: new URL(data.url).pathname,
          searchParams: Object.fromEntries(new URL(data.url).searchParams)
        });

        window.location.href = data.url;
      } else {
        debugLog('GOOGLE', 'NO URL returned from OAuth!', undefined, 'error');
      }

      return { error };
    } catch (error) {
      debugLog('GOOGLE', 'EXCEPTION in signInWithGoogle', error, 'error');
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    debugLog('SIGNOUT', 'Signing out...');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    debugLog('SIGNOUT', 'Signed out', undefined, 'success');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      debugLog('PROFILE', 'updateProfile called with no user', undefined, 'error');
      return { error: new Error('No user logged in') };
    }

    try {
      debugLog('PROFILE', 'Updating profile...', updates);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        debugLog('PROFILE', 'Update error', error.message, 'error');
        throw error;
      }

      debugLog('PROFILE', 'Profile updated', undefined, 'success');
      await loadProfile(user.id);
      return { error: null };
    } catch (error) {
      debugLog('PROFILE', 'Update exception', error, 'error');
      return { error: error as Error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
