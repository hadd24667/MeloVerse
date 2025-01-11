import React from 'react';

const LoadingOverlay = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-t-pink-200 h-24 w-24 mb-4"></div>
                <p className="text-white text-xl">Please wait</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;