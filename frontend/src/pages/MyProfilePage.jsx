// frontend/src/pages/MyProfilePage.jsx
import React from 'react';
import { useUser } from '../hooks/useUser';

export function MyProfilePage() {
    const { user } = useUser();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>My Profile</h1>
            <img src={user.imagePath} alt="Profile" />
            <p>Username: {user.userName}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}