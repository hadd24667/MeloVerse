import React, { useEffect, useState, useRef, useContext } from "react";
import axiosInstance from "../config/axiosCustomize";
import { createContext } from "react";
import { useUser } from "./UserContext";

export const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [songQueue, setSongQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [listenInterval, setListenInterval] = useState(null);

  const { user } = useUser();
  const userID = user?.id;

  const incrementPlayCount = async (songId, userId) => {
    try {
        console.log('Calling incrementPlayCount with:', { songId, userId });
        const response = await axiosInstance.post('songs/increment-play', {
          songID: songId, 
          userID: userId
      });
        console.log(response.data);
    } catch (error) {
        console.error('Error incrementing play count:', error);
    }
};
  //fetch song data from backend
  const fetchSong = async (songId, onSongClick) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/songs?id=${songId}`);
      const songData = response.data[0];
      console.log("API Response Data:", songData)
      setSelectedSong({
        ...songData,
        artistID: songData.Artist?.id || songData.artistID,
        artistName: songData.Artist?.userName || "Unknown Artist",
        artistImage: songData.Artist?.imagePath || "../../public/assets/defaultArtist.png",
      });
      incrementPlayCount(songId, userID);
      console.log("Processed Song Data:", {
        id: songData.id,
        trackTitle: songData.trackTitle,
        artistID: songData.Artist?.id || songData.artistID,
        artistName: songData.Artist?.userName,
      });

      // Update audio source
      if (audioRef.current) {
        audioRef.current.src = songData.filePath;
        audioRef.current.load();
      }

      // Callback from queue
      if (onSongClick) {
        await onSongClick(songId);
      }
    } catch (err) {
      setError(err.message || "bug roi");
    } finally {
      setLoading(false);
    }
  };

  // save initial history
  const saveInitialHistory = async (songID, userID) => {
    try {
      const response = await axiosInstance.post('/save-history', {
        songID,
        userID,
        listenTime: 0,
      });
      console.log('Initial history saved:', response.data);
    } catch (error) {
      console.error('Error saving initial history:', error);
    }
  };
  // update listen time
  const updateListenTime = async (songID, userID, listenTime) => {
    console.log('Calling updateListenTime with:', { songID, userID, listenTime });
    try {
      const response = await axiosInstance.post('/update-history', {
        songID,
        userID,
        listenTime,
      });
      console.log('Listen time updated:', response.data);
    } catch (error) {
      console.error('Error updating listen time:', error);
    }
  };

    // toggle play/pause
    const togglePlayPause = () => {
      console.log("togglePlayPause called");
      console.log("isPlaying:", isPlaying);
      if (isPlaying) {
        // Khi nhấn dừng
        audioRef.current.pause();
        clearInterval(listenInterval);
    
        // Gọi API để cập nhật thời gian nghe
        console.log('selectedSong:', selectedSong);
        console.log('userID:', userID);
        if (selectedSong && userID) {
          console.log('selectedSong:', selectedSong);
          console.log('userID:', userID);
          const listenTime = Math.floor(audioRef.current.currentTime); // Thời gian đã nghe
          console.log('Updating listen time on pause:', { songID: selectedSong.id, userID, listenTime });
          updateListenTime(selectedSong.id, userID, listenTime);
        }
      } else {
        // Khi nhấn phát
        audioRef.current.play();
        const interval = setInterval(() => {
          setCurrentTime(audioRef.current.currentTime);
        }, 1000);
        setListenInterval(interval);
      }
      setIsPlaying(!isPlaying); // Cập nhật trạng thái
    };
    

  // update current playback time
  const updateTime = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // set up event listeners for audio
  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
      const handleLoadedMetadata = () => setDuration(audioRef.current.duration);
      const handleSongEnd = () => {
        clearInterval(listenInterval);
        updateListenTime(selectedSong.id, userID, Math.floor(audioRef.current.currentTime));
        playNextSong();
      };

      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("ended", handleSongEnd);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
          audioRef.current.removeEventListener("ended", handleSongEnd);
        }
      };
    }
  }, [audioRef, listenInterval, selectedSong, userID]);

  const playNextSong = () => {
    if (songQueue.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % songQueue.length;
    const nextSong = songQueue[nextIndex];
    fetchSong(nextSong.id);
    setCurrentSongIndex(nextIndex);
  };

  return (
    <SongContext.Provider
      value={{
        selectedSong,
        fetchSong,
        setIsPlaying,
        isPlaying,
        togglePlayPause,
        currentTime,
        setCurrentTime,
        duration,
        updateTime,
        audioRef,
        playNextSong,
        songQueue,
        setSongQueue,
        loading,
        error,
        saveInitialHistory,
        updateListenTime,
      }}
    >
      {children}
      <audio ref={audioRef} src={selectedSong?.audioPath} />
    </SongContext.Provider>
  );
};
