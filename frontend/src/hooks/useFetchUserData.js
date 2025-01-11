import { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosCustomize';

const useUserData = (endpoint) => {
    const [user, setUser] = useState(null);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            let response;

            if (token) {
                response = await axiosInstance.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                response = await axiosInstance.get(endpoint, { withCredentials: true });
            }

            if (response && response.data) {
                setUser(response.data);
            } else {
                console.error('Response is undefined or does not contain data');
            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [endpoint]);

    return { user, fetchUserData };
};

export default useUserData;
