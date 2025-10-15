import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchUserProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      setUser({ id: authUser.id, email: authUser.email });
    } else {
      setUser({ id: authUser.id, email: authUser.email, ...profile });
    }
    setLoading(false);
  }, []);

  // Initialize session and auth state change
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await fetchUserProfile(session?.user);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await fetchUserProfile(session?.user);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  // Login function
  const login = async (email, password) => {
    email = email.trim();
    password = password.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
      throw new Error("Invalid email");
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      throw error;
    }

    toast({ title: "Login Successful 🎉", description: `Welcome back!` });
  };

  // Signup function
  const signup = async (email, password, name, role = 'student', adminCode = '') => {
    email = email.trim();
    password = password.trim();
    name = name.trim();
    role = role.trim();
    adminCode = adminCode.trim();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
      throw new Error("Invalid email");
    }

    // Admin code validation
    if (role === 'admin' && adminCode !== 'MBSCET') {
      toast({ title: "Invalid Admin Code", description: "You cannot sign up as admin without the correct code.", variant: "destructive" });
      throw new Error("Invalid admin code");
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });

    if (error) {
      toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
      throw error;
    }

    // Ensure profile exists in 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: data.user.id, name, role });

    if (profileError) {
      console.error('Error saving profile:', profileError);
    }

    toast({ title: "Signup Successful 🎉", description: "Please check your email to verify your account." });

    return data;
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    if (error) {
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logged Out", description: "See you soon!" });
    }
  };

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
