import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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

    const initAuth = async () => {
      console.log('AuthContext: initAuth started');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('AuthContext: getSession result:', session?.user?.email);

      if (mounted) {
        if (session?.user) {
          console.log('AuthContext: Found session, setting user and loading profile');
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          console.log('AuthContext: No session found');
          setUser(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      console.log('AuthContext: onAuthStateChange event:', event, 'user:', session?.user?.email);

      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          console.log('AuthContext: User signed in, loading profile');
          await loadProfile(session.user.id);
        } else {
          console.log('AuthContext: User signed out');
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string, retries = 5) => {
    try {
      console.log('Loading profile for user:', userId);

      for (let i = 0; i < retries; i++) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
          throw error;
        }

        if (data) {
          console.log('Profile loaded:', data);
          setProfile(data);
          setLoading(false);
          return;
        }

        if (i < retries - 1) {
          console.log(`Profile not found, retry ${i + 1}/${retries - 1}`);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.error('Profile not found after retries');
      setProfile(null);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/student/confirm`
        }
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('=== GOOGLE SIGN IN START ===');
      console.log('Current location:', window.location.href);
      console.log('Redirect URL:', redirectUrl);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

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

      console.log('signInWithOAuth response data:', data);
      console.log('signInWithOAuth response error:', error);
      console.log('=== GOOGLE SIGN IN END ===');

      if (data?.url) {
        window.location.href = data.url;
      }

      return { error };
    } catch (error) {
      console.error('=== GOOGLE SIGN IN EXCEPTION ===');
      console.error('Exception:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await loadProfile(user.id);
      return { error: null };
    } catch (error) {
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
