import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/user/profile`, { withCredentials: true });
            setUser(response.data.user_data);
        }
        catch (err) {
            setUser(null);
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    const setAuthError = (error) => {
        setError(error);
    };

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        setUser(null);
        if (!email || !password) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password }, { withCredentials: true });
            setUser(response.data.user_data);
        }
        catch (err) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || "An error occurred");
        }
        finally {
            setIsLoading(false);
        }
    };

    const googleLogin = async (googleToken) => {
        setIsLoading(true);
        setError(null);
        setUser(null);
        if (!googleToken) {
            setError("Google login failed");
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/user/google-login`, { google_token: googleToken }, { withCredentials: true });
            setUser(response.data.user_data);
        }
        catch (err) {
            console.error("Google login failed:", err);
            setError(err.response?.data?.message || "An error occurred");
        }
        finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password, confirmPassword) => {
        setIsLoading(true);
        setError(null);
        setUser(null);
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/user/register`, { name, email, password }, { withCredentials: true });
            setUser(response.data.user_data);
        }
        catch (err) {
            console.error("Registration failed:", err);
            setError(err.response?.data?.message || "An error occurred");
        }
        finally {
            setIsLoading(false);
        }
    };

    const googleRegister = async (googleToken) => {
        setIsLoading(true);
        setError(null);
        setUser(null);
        if (!googleToken) {
            setError("Google registration failed");
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/user/google-register`, { google_token: googleToken }, { withCredentials: true });
            setUser(response.data.user_data);
        }
        catch (err) {
            console.error("Google register failed:", err);
            setError(err.response?.data?.message || "An error occurred");
        }
        finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.post(`${API_BASE_URL}/user/logout`, {}, { withCredentials: true });
            setUser(null);
        }
        catch (err) {
            console.error("Logout failed:", err);
            setError(err.response?.data?.message || "An error occurred");
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const value = {
        user,
        isLoading,
        error,
        login,
        googleLogin,
        googleRegister,
        setAuthError,
        register,
        logout,
        fetchUser,
    };

    return (
        <AuthContext.Provider value={value}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                {children}
            </GoogleOAuthProvider>
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
