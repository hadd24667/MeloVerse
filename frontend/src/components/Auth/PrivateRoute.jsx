import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext.jsx';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();

    if (!user) {
        // If user is not logged in, redirect to login page
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user does not have the required role, redirect to not found page
        return <Navigate to="/not-found" />;
    }

    // If user is authenticated and has the required role, render the children components
    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.array,
};

export default PrivateRoute;