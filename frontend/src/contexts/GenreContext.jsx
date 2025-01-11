import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../config/axiosCustomize";

const GenreContext = createContext();

export const useGenre = () => useContext(GenreContext);

export const GenreProvider = ({ children }) => {
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSongByGenre = async (genre) => {
        setError(null);
        setLoading(true);

        try {
            const response = await axiosInstance.get(`/genres/${genre}`);
            console.log('Songs Data:', response.data.data);
            const songByGenreData = response.data.data;
            setSongs(songByGenreData); 
            setSelectedGenre(genre);
        } catch (err) {
            setError(err.message || 'Failed to fetch songs');
        } finally {
            setLoading(false);
        }
    }

    return (
        <GenreContext.Provider value={{ selectedGenre, setSelectedGenre, fetchSongByGenre, songs, loading, error }}>
            {children}
        </GenreContext.Provider>
    );
};
