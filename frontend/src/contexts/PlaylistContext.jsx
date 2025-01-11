import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../config/axiosCustomize";

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPlaylist = async (userID) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/create-playlist", { userID });
      const newPlaylist = response.data.playlist;
      setPlaylists([...playlists, newPlaylist]);
      setCurrentPlaylist(newPlaylist);
      return newPlaylist;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create playlist");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchSongs = async (query) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/search-song-in-playlist", {
        params: { query },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to search songs");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addSongToPlaylist = async (playlistID, songID) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/add-song-to-playlist", {
        playlistID,
        songID,
      });
      if (currentPlaylist?.id === playlistID) {
        setPlaylistSongs([...playlistSongs, response.data.song]);
      }
      await getPlaylistSongs(playlistID);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add song");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPlaylistSongs = async (playlistID) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/playlist/${playlistID}`);
      const songsWithArtists = response.data.songs.map((song) => ({
        ...song,
        Artist: song.Artist || { userName: "Unknown Artist" },
      }));
      setPlaylistSongs(songsWithArtists);
      return songsWithArtists;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get playlist songs");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeSongFromPlaylist = async (playlistID, songID) => {
    try {
      setLoading(true);
      await axiosInstance.delete("/remove-song-from-playlist", {
        data: { playlistID, songID },
      });
      if (currentPlaylist?.id === playlistID) {
        setPlaylistSongs(playlistSongs.filter((song) => song.id !== songID));
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove song");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserPlaylists = async (userID) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/all-playlists/${userID}`);
      setPlaylists(response.data.playlists);
      return response.data.playlists;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get user playlists");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePlaylist = async (playlistID, data) => {
    try {
        setLoading(true);
        const response = await axiosInstance.put(`/playlist/${playlistID}`, data);
        
        // Update local states
        if (currentPlaylist?.id === playlistID) {
            setCurrentPlaylist(response.data.playlist);
        }
        
        // Update playlists list
        setPlaylists(playlists.map(playlist => 
            playlist.id === playlistID ? response.data.playlist : playlist
        ));

        return response.data.playlist;
    } catch (err) {
        setError(err.response?.data?.error || "Failed to update playlist");
        throw err;
    } finally {
        setLoading(false);
    }
};

const getPlaylistDetails = async (playlistID) => {
    try {
        setLoading(true);
        const response = await axiosInstance.get(`/playlist-details/${playlistID}`);
        setCurrentPlaylist(response.data.playlist);
        setPlaylistSongs(response.data.songs);
        return response.data;
    } catch (err) {
        setError(err.response?.data?.error || "Failed to get playlist details");
        throw err;
    } finally {
        setLoading(false);
    }
};

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        currentPlaylist,
        playlistSongs,
        loading,
        error,
        createPlaylist,
        searchSongs,
        addSongToPlaylist,
        getPlaylistSongs,
        removeSongFromPlaylist,
        getUserPlaylists,
        setCurrentPlaylist,
        updatePlaylist,
        getPlaylistDetails
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};
