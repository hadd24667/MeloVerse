import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axiosCustomize';
import { useUser } from './UserContext';

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState([]);
    const { user } = useUser();
    const userID = user?.id;
    let isSaving = false;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {

            if (!userID) {
                console.log('User ID not found', userID);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get(`/history/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                console.log('history: ',response.data);
                setHistory(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userID]);

    const saveHistory = async (songID) => {
        if (isSaving) return; // Chặn nếu đang lưu
        isSaving = true;
    
        try {
            const response = await axiosInstance.post('/save-history', {
                userID,
                songID,
                timeListened: new Date()
              });
              
            setHistory((prevHistory) => [response.data, ...prevHistory]);
        } catch (err) {
            setError(err);
        } finally {
            isSaving = false;
        }
    };
    return (
        <HistoryContext.Provider value={{ history, saveHistory, loading, error }}>
            {children}
        </HistoryContext.Provider>
    );
};