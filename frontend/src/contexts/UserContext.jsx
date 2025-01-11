import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axiosCustomize';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            // let response;

            if (token) {
                const response = await axiosInstance.get('/userinfo', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }

            // setUser(response.data);
            // console.log('User data fetched:', response.data);
        } catch (error) {
            console.error('Error fetching user data', error);
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    const updateProfile = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                throw new Error('Token not found');
            }

            const response = await axiosInstance.put('/update-profile', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(response.data.user);
            console.log('Profile updated:', response.data.user);

            return response.data.user;
        } catch (error) {
            console.error('Error updating profile', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchUserData();

        const handleStorageChange = (event) => {
            if (event.key === 'token') {
                fetchUserData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, fetchUserData, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);