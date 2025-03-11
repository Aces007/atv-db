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
    };

    const updateUserInfo = async (userId, updatedData) => {
        if (!userId) {
            console.error("User ID is missing.");
            return;
        }
    
        try {
            const { error } = await supabase
                .from('Users') 
                .update(updatedData)
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
    

    const handleUploadMaterial = async (materialData) => {
        setLoading(true);

        try {
            const {data, error} = await supabase
                .from("Materials")
                .insert([materialData]);

            if (error) throw error;

            console.log("Material uploaded successfully!", data);
            alert("Material uploaded successfully!");
        } catch (error)  {
            console.error("Error uploading material:", error.message);
            alert("Failed to upload material. Please try again.");
        } finally {
            setLoading(false);
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
                .select('name, email, birthdate, age, course, student_number')
                .eq("id", userId)
                .single();
    
            if (error) throw error;
    
            console.log("Fetched User Data:", data);
    
            setUserInfo(data);
            return {
                full_name: data.name,
                userEmail: data.email,
                userBirthdate: data.birthdate,
                userAge: data.age,
                userCourse: data.course,
                userStudentNumber: data.student_number,
            };
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
                handleLogout, fetchUserInfo, updateUserInfo, handleUploadMaterial}}
        >
            {children}
        </WebsiteContext.Provider>
    )
}

export const useWebsiteContext = () => useContext(WebsiteContext);