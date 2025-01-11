import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../config/axiosCustomize";

const AlbumContext = createContext();

export const useAlbum = () => useContext(AlbumContext);

export const AlbumProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]); // Trạng thái lưu danh sách album
  const [album, setAlbum] = useState(null); // Trạng thái lưu danh sách bài hát của albumalbum
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  // Hàm lấy danh sách top albums
  const topAlbum = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/top-albums");
      setAlbums(response.data.albums); // Lưu danh sách album
    } catch (err) {
      console.error("Error fetching top albums:", err);
      setError("Failed to fetch albums.");
    } finally {
      setLoading(false);
    }
  };

  const albumDetail = async (albumID) => {
    setLoading(true);
    setError(null);
    try {
    console.log('Fetching album details for ID:', albumID);
      const response = await axiosInstance.get(`/get-album-details/${albumID}`);
      console.log('Album details received:', response.data);
      setAlbum(response.data); // Lưu danh sách album
    } catch (err) {
      console.error("Error fetching top albums:", err);
      setError("Failed to fetch albums.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlbumContext.Provider value={{ albums, topAlbum, album, albumDetail, loading, error }}>
      {children}
    </AlbumContext.Provider>
  );
};
