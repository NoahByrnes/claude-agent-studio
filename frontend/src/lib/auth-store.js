import { create } from 'zustand';
import { supabase } from './supabase';
export const useAuthStore = create((set) => ({
    user: null,
    session: null,
    loading: true,
    initialized: false,
    initialize: async () => {
        try {
            const { data: { session }, } = await supabase.auth.getSession();
            set({
                session,
                user: session?.user ?? null,
                loading: false,
                initialized: true,
            });
            // Listen for auth changes
            supabase.auth.onAuthStateChange((_event, session) => {
                set({
                    session,
                    user: session?.user ?? null,
                });
            });
        }
        catch (error) {
            console.error('Auth initialization error:', error);
            set({ loading: false, initialized: true });
        }
    },
    signIn: async (email, password) => {
        set({ loading: true });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error)
                throw error;
            set({
                session: data.session,
                user: data.user,
                loading: false,
            });
        }
        catch (error) {
            set({ loading: false });
            throw error;
        }
    },
    signUp: async (email, password) => {
        set({ loading: true });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error)
                throw error;
            set({
                session: data.session,
                user: data.user,
                loading: false,
            });
        }
        catch (error) {
            set({ loading: false });
            throw error;
        }
    },
    signOut: async () => {
        set({ loading: true });
        try {
            const { error } = await supabase.auth.signOut();
            if (error)
                throw error;
            set({
                session: null,
                user: null,
                loading: false,
            });
        }
        catch (error) {
            set({ loading: false });
            throw error;
        }
    },
}));
//# sourceMappingURL=auth-store.js.map