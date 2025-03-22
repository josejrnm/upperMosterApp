import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
    loggedIn: boolean
    redirectPath: String
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedProps> = ({ loggedIn, redirectPath, children }) => {
    if (!loggedIn) {
        return <Navigate to={`${redirectPath}`} />;
    }
    return children;
};

export default ProtectedRoute;