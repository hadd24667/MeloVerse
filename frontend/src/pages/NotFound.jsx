import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-white text-center p-4">
            <h1 className="text-7xl display-1 fw-bold">404</h1>
            <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
            <p className="text-lg mt-2">It seems you've wandered off track. Let's get you back to enjoying some music!</p>
        </div>
    );
};  

export default NotFound;
