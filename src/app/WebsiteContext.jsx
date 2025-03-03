"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const WebsiteContext = createContext();

export const WebProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (name, email, password, month, day, year, age) => {
        setLoading(true);
    
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
    
            const user = data?.user;
    
            if (error) throw error;
            if (!user) throw new Error('User not created');
    

            const birthdate = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            console.log("Formatted Birthdate:", birthdate); // Debugging log


            const { error: insertError } = await supabase
                .from('Users')
                .insert([{ id: user.id, name, email, birthdate, age, password }]);
    
            if (insertError) throw insertError;
    
            setUser(user);
            alert('Signup Successful!');
            router.push('./homepage/');
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


    const fetchUserInfo = async (userId) => {
        try {
            const {data, error} = await supabase
                .from('Users')
                .select('name, email, birthdate, age, password')
                .eq("id", userId)
                .single()

            if (error) throw (error);

            setUserInfo(data);

            return {
                full_name: data.name,
                email: data.email,
                birthdate: data.birthdate,
                age: data.age,
            };
        } catch (error) {
            console.error("Error fetching user info: ", error.message);
        }
    };

    useEffect(() => {
        const getUserSession = async () => {
            const { data: {session} } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);
                fetchUserInfo(session.user.id);
            }
        };

        getUserSession();
    }, []);

    return (
        <WebsiteContext.Provider
            value={{user, loading, userInfo, handleSignup, handleLogin, handleLogout, fetchUserInfo}}
        >
            {children}
        </WebsiteContext.Provider>
    )
}

export const useWebsiteContext = () => useContext(WebsiteContext);