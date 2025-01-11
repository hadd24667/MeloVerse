import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axiosCustomize';

// Tạo Context
export const ArtistContext = createContext();

// Tạo Provider
export const ArtistProvider = ({ children }) => {
    const [artists, setArtists] = useState([]);
    const [artistData, setArtistData] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    // Hàm gọi API để lấy danh sách nghệ sĩ
    const fetchArtists = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/get-popular-artists');
            setArtists(response.data.artists); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Hàm gọi API để lấy thông tin của nghệ sĩ kèm danh sách bài hát
    const fetchArtistDetails = async (artistID) => {
        try {
            setLoading(true);
            console.log('artistID: ',artistID);
            const response = await axiosInstance.get(`/get-artist-details/${artistID}`);

            // Lưu danh sách bài hát trong context
            const artistDetails = response.data.artist; 
            setArtistData(artistDetails); 
            setSongs(artistDetails.Songs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

     // Gọi API khi component được render lần đầu
     useEffect(() => {
        fetchArtists();
    }, []);
   
    return (
        <ArtistContext.Provider value={{ artists, loading, error, fetchArtists, songs, fetchArtistDetails, artistData }}>
            {children}
        </ArtistContext.Provider>
    );
};
