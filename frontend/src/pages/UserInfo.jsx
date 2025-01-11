import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../services/UploadService';
import defaultAvt from '../assets/profile.png';
import '../styles/Profile.css';

export const UserInfo = () => {
    const { user, updateProfile } = useUser();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        userName: user?.userName || '',
        email: user?.email || '',
        profile: user?.profile || '',
        imagePath: user?.imagePath || defaultAvt,
    });
    const [previewImage, setPreviewImage] = useState(formData.imagePath);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert('No file selected.');
            return;
        }

        try {
            // preview
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);

            // Upload img on Firebase
            const uploadedImageUrl = await uploadImage(file);
            setFormData({ ...formData, imagePath: uploadedImageUrl }); 
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        }
    };

    const handleSave = async () => {
        try {
            await updateProfile(formData); 
            alert('Profile updated successfully!');
            setEditing(false); 
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        }
    };

    if (!user) {
        return <div className="profile-loading">Loading user information...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <i className="bx bx-arrow-back back-button" onClick={handleBack}></i>
                <div className="profile-header">
                    <label htmlFor="uploadImage" className="avatar-label">
                        <img
                            src={previewImage}
                            alt="User profile"
                            className="profile-avatar"
                        />
                        {editing && (
                            <input
                                type="file"
                                id="uploadImage"
                                accept="image/*"
                                className="file-input"
                                onChange={handleImageChange}
                            />
                        )}
                    </label>
                    {editing ? (
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            className="edit-input"
                        />
                    ) : (
                        <h2 className="profile-username">{user?.userName || 'Unknown User'}</h2>
                    )}
                    <p className="profile-role">Role: {user?.role || 'No role assigned'}</p>
                </div>
                <div className="profile-body">
                    {editing ? (
                        <>
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="edit-input"
                            />
                            <label>Bio:</label>
                            <textarea
                                name="profile"
                                value={formData.profile}
                                onChange={handleChange}
                                className="edit-textarea"
                            />
                        </>
                    ) : (
                        <>
                            <p><strong>ID:</strong> {user?.id}</p>
                            <p><strong>Email:</strong> {user?.email || 'No email provided'}</p>
                            <p><strong>Bio:</strong> {user?.profile || 'No bio provided'}</p>
                        </>
                    )}
                </div>
                <div className="profile-actions">
                    {editing ? (
                        <button className="save-button" onClick={handleSave}>
                            Save
                        </button>
                    ) : (
                        <button className="edit-button" onClick={() => setEditing(true)}>
                            Edit Profile
                        </button>
                    )}
                    <button className="logout-button" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
