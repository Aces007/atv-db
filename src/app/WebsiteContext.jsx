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
                .insert([{ id: user.id, name, email, birthdate, age}]);
    
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
            console.log("User logged in:", data.user);

            await fetchUserInfo(data.user.id);

            alert('Login Process Successful');
            router.push('./homepage/');
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
            setUserInfo(null);

            console.log("User logged out, state cleared");

            alert('Account Logged Out Successfully');

            router.replace("/loginpage"); // ✅ Forces re-render without full refresh
        } catch (error) {
            console.error('Error during logout:', error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleUploadMaterial = async (materialData) => {
        setLoading(true);
        
        try {
            const {data, error} = await supabase
            .from("Materials")
            .insert([materialData]);
            
            if (error) throw error;

            console.log("Material uploaded successfully! Please wait for approval for it be displayed.", data);
            alert("Material uploaded successfully!");
        } catch (error)  {
            console.error("Error uploading material:", error.message);
            alert("Failed to upload material. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const handlePasswordUpdate = async (password, confirmPassword) => {
        if (password != confirmPassword) {
            alert("Passwords do not match. Try again..")
            return;
        }
        
        const { error } = await supabase.auth.updateUser({
            password
        })
    
        if (error) {
            alert("Error updating password: " + error.message);
        }
        else {
            alert("Password updated successfully!");
        }
    }

    const updateUserInfo = async (userId, updatedData) => {
        if (!userId) {
            console.error("User ID is missing.");
            return;
        }

        const payload = {
            nickname: updatedData.nickname ?? null,
            gender: updatedData.gender ?? null,
            student_number: updatedData.student_number ?? null,
            personal_email: updatedData.personal_email ?? null,
            mobile_number: updatedData.mobile_number ?? null,
            course: updatedData.course ?? null,
            profile_url: updatedData.profile_url ?? null,   
        }

        try {
            const { error } = await supabase
                .from('Users') 
                .update(payload)
                .eq("id", userId);
    
            if (error) throw error;
    
            console.log("User information updated successfully!");
            alert("Profile updated successfully!");
            fetchUserInfo(userId);
        } catch (error) {
            console.error("Error updating user info:", error.message);
            alert("Failed to update profile. Please try again.");
        }
    };


    const fetchUserInfo = async (userId) => {
        if (!userId) {
            console.error("User ID is missing.");
            return null;
        }
    
        try {
            const { data, error } = await supabase
                .from('Users') 
                .select('name, email, gender, nickname, birthdate, age, course, student_number, personal_email, mobile_number, is_admin, profile_url')
                .eq("id", userId)
                .single();
    
            if (error) throw error;
    
            console.log("Fetched User Data:", data);
    
            setUserInfo(data);
            return data;
            
        } catch (error) {
            console.error("Error fetching user info:", error.message);
        }
    };
    

    useEffect(() => {
        const getUserSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            console.log("Session Data:", session); // Debugging
            if (session?.user) {
                console.log("User ID:", session.user.id); // Debugging
                setUser(session.user);
                fetchUserInfo(session.user.id);
            }
        };
        getUserSession();
    }, []);
    

    return (
        <WebsiteContext.Provider
            value={{user, loading, userInfo, handleSignup, handleLogin, 
                handleLogout, fetchUserInfo, updateUserInfo, handleUploadMaterial, handlePasswordUpdate}}
        >
            {children}
        </WebsiteContext.Provider>
    )
}

export const useWebsiteContext = () => useContext(WebsiteContext);