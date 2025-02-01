"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const WebsiteContext = createContext();

export const WebProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error fetching session:", error);
                return;
            }

            if (data?.session) {
                setUser(data.session.user);
            }

            setLoading(false);

        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleSignup = async (email, password, month, day, year) => {
        setLoading(true);
    
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
    
            // Access `user` from the `data` object
            const user = data?.user;
    
            if (error) throw error;
            if (!user) throw new Error('User not created');
    
            // Format the birthdate
            const birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
            // Insert additional user information into your `Users` table
            const { error: insertError } = await supabase
                .from('Users')
                .insert([{ id: user.id, email, birthdate }]);
    
            if (insertError) throw insertError;

            setUser(user);    
            alert('Signup Process Successful!');

            router.push('./homepage/')
        } catch (error) {
            console.error('Error during signup:', error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    
    const handleLogin = async(email, password) => {
        setLoading(true);

        try {
            const { error, data } = await supabase.auth.signInWithPassword({
                email, password,
            });
            if (error) throw error;

            setUser(data.user);
            console.log(data.user);
            alert('Login Process Successful');
            
            
            router.push('./homepage/')
        } catch (error) {
            console.error('Error during login:', error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = async() => {
        setLoading(true);

        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            setUser(null);
            alert('Account Logged Out Successfully')

            router.push('./loginpage/')
        } catch (error) {
            console.error('Error during logout:', error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <WebsiteContext.Provider
            value={{user, loading, handleSignup, handleLogin, handleLogout}}
        >
            {children}
        </WebsiteContext.Provider>
    )
}

export const useWebsiteContext = () => useContext(WebsiteContext);