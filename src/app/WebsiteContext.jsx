"use client"

import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const WebsiteContext = createContext();

export const WebProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    

    const handleSignup = async(email, password, month, day, year) => {
        setLoading(true);

        try {
            const { error, user } = await supabase.auth.signUp({
                email, password,
            });
            if (error) throw error;

            const birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const { error: insertError } = await supabase
                .from('Users')
                .insert([{ id: user.id, email, birthdate }]);
            
            if (insertError) throw insertError;

            alert('Signup Process Successful!')
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
            alert('Login Process Successful');
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