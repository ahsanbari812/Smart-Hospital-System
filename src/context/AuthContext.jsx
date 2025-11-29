import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data.data);
            } catch (error) {
                console.error('Session expired or invalid:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, ...userData } = res.data.data;
            localStorage.setItem('token', token);
            // We can store user data, but 'me' endpoint is source of truth
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            // Do NOT set user or token here. Let the user login explicitly.
            return res.data.data;
        } catch (error) {
            throw error;
        }
    }

    const value = {
        user,
        login,
        logout,
        register,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
