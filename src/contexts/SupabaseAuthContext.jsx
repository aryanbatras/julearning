import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const { toast } = useToast();

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async (user) => {
        if (user) {
            const { data, error } = await supabase
                .from('profiles')
                .select('role, name')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
                setProfile(null);
                return null;
            }
            setProfile(data);
            return data;
        }
        setProfile(null);
        return null;
    }, []);

    useEffect(() => {
        setLoading(true);
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser);
            }
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                if (currentUser) {
                    await fetchProfile(currentUser);
                } else {
                    setProfile(null);
                }
                if (event === 'INITIAL_SESSION') {
                    setLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const signUp = useCallback(async (email, password, name, role, adminDetails = null, imageFile = null) => {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: role,
                },
            },
        });

        if (error) {
            console.error("Sign up error:", error);
            toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
            setLoading(false);
            return { user: null, error };
        }

        if (data.user && role === 'admin' && adminDetails) {
            try {
                // Upload profile image if provided
                let imageUrl = null;
                if (imageFile) {
                    const fileExt = imageFile.name.split('.').pop();
                    const fileName = `profile-${data.user.id}-${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage.from('admin_profiles').upload(fileName, imageFile);
                    if (uploadError) {
                        console.error("Image upload failed:", uploadError);
                    } else {
                        const { data: urlData } = supabase.storage.from('admin_profiles').getPublicUrl(fileName);
                        imageUrl = urlData?.publicUrl ?? null;
                    }
                }

                // Save admin profile data
                const profileData = {
                    id: data.user.id,
                    college: adminDetails.college || '',
                    bio: adminDetails.bio || '',
                    message_for_juniors: adminDetails.message_for_juniors || '',
                    social_links: adminDetails.social_links || { instagram: '', linkedin: '', other: '' },
                    profile_image_url: imageUrl,
                };

                const { error: adminProfileError } = await supabase.from('admin_profiles').insert(profileData);
                if (adminProfileError) {
                    console.error("Failed to save admin details:", adminProfileError);
                    toast({
                        title: "Warning",
                        description: "Account created but profile details couldn't be saved. Please update your profile later.",
                        variant: "destructive"
                    });
                } else {
                    toast({
                        title: "Success!",
                        description: "Admin account created successfully with profile details!",
                    });
                }
            } catch (adminError) {
                console.error("Admin profile creation error:", adminError);
                toast({
                    title: "Warning",
                    description: "Account created but profile setup incomplete. Please contact support.",
                    variant: "destructive"
                });
            }
        } else if (data.user) {
            toast({
                title: "Success!",
                description: "Account created. Please check your email for verification.",
            });
        }

        setLoading(false);
        return { user: data.user, error: null };
    }, [toast]);

    const signIn = useCallback(async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Sign in error:", error);
            toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
            setLoading(false);
            return { user: null, profile: null, error };
        }

        if (data.user) {
            const userProfile = await fetchProfile(data.user);
            setLoading(false);
            return { user: data.user, profile: userProfile, error: null };
        }

        setLoading(false);
        return { user: null, profile: null, error: new Error("Could not sign in.") };
    }, [fetchProfile, toast]);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
    }, []);

    const updateAdminProfile = useCallback(async (adminDetails, imageFile = null) => {
        setLoading(true);

        try {
            // Upload new profile image if provided
            let imageUrl = null;
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `profile-${user?.id}-${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('admin_profiles').upload(fileName, imageFile);
                if (uploadError) {
                    console.error("Image upload failed:", uploadError);
                } else {
                    const { data: urlData } = supabase.storage.from('admin_profiles').getPublicUrl(fileName);
                    imageUrl = urlData?.publicUrl ?? null;
                }
            }

            // Update admin profile data
            const profileData = {
                college: adminDetails.college || '',
                bio: adminDetails.bio || '',
                message_for_juniors: adminDetails.message_for_juniors || '',
                social_links: adminDetails.social_links || { instagram: '', linkedin: '', other: '' },
                ...(imageUrl && { profile_image_url: imageUrl }),
            };

            const { error: adminProfileError } = await supabase
                .from('admin_profiles')
                .update(profileData)
                .eq('id', user?.id);

            if (adminProfileError) {
                console.error("Failed to update admin details:", adminProfileError);
                toast({
                    title: "Error",
                    description: "Failed to update profile. Please try again.",
                    variant: "destructive"
                });
                setLoading(false);
                return { error: adminProfileError };
            }

            toast({
                title: "Success!",
                description: "Profile updated successfully!",
            });

            setLoading(false);
            return { error: null };
        } catch (error) {
            console.error("Admin profile update error:", error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive"
            });
            setLoading(false);
            return { error };
        }
    }, [user?.id, toast]);

    const value = useMemo(() => ({
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateAdminProfile,
    }), [user, profile, session, loading, signUp, signIn, signOut, updateAdminProfile]);

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
