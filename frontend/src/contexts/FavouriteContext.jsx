import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../config/axiosCustomize';
import { useUser } from './UserContext';

const FavouriteContext = createContext();

export const useFavourite = () => useContext(FavouriteContext);

export const FavouriteProvider = ({ children }) => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();

    const getFavourites = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/fav/${user.id}`);
            setFavourites(response.data);
            console.log('Favourites:', response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addFavourite = async (type, id) => {
        if (!user?.id) return;
        try {
            const payload = {
                listenerID: user.id,
                [`${type}ID`]: id
            };
            await axiosInstance.post('/add-fav', payload);
            getFavourites();
        } catch (error) {
            setError(error.message);
        }
    };

    const removeFavourite = async (type, id) => {
        if (!user?.id) return;
        try {
            const payload = {
                listenerID: user.id,
                [`${type}ID`]: id
            };
            await axiosInstance.delete('/remove-fav', { data: payload });
            getFavourites();
        } catch (error) {
            setError(error.message);
        }
    };

    const isFavourite = (type, id) => {
        return favourites.some(fav => {
            const typeKey = `${type}ID`;
            return fav[typeKey] === parseInt(id);
        });
    };

    const toggleFavourite = async (type, id) => {
        if (!user?.id) return;
        
        try {
            const isCurrentlyFavorite = isFavourite(type, id);
            console.log('Current favorite status:', isCurrentlyFavorite);

            if (isCurrentlyFavorite) {
                await removeFavourite(type, id);
            } else {
                await addFavourite(type, id);
            }
            
            // Refresh favorites list immediately
            await getFavourites();
            
        } catch (error) {
            console.error('Error toggling favourite:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        getFavourites();
    }, [user?.id]);

    const value = {
        favourites,
        loading,
        error,
        addFavourite,
        removeFavourite,
        getFavourites,
        isFavourite,
        toggleFavourite
    };

    return (
        <FavouriteContext.Provider value={value}>
            {children}
        </FavouriteContext.Provider>
    );
};