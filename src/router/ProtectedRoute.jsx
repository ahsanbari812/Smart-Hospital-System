import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingFallback from '../components/LoadingFallback';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, validateSession } = useAuth();
    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            if (user) {
                // Validate session with backend
                const valid = await validateSession();
                setIsValid(valid);
            }
            setIsValidating(false);
        };

        checkSession();
    }, [user, validateSession]);

    if (isValidating) {
        return <LoadingFallback />;
    }

    if (!user || !isValid) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role, or unauthorized page
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
        if (user.role === 'patient') return <Navigate to="/patient" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
