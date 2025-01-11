import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import axiosInstance from "../config/axiosCustomize";
import { createContext } from "react";
import { useUser } from "./UserContext";
import { SongContext } from "./SongContext";
export const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState("PlayerAction");
  const { selectedSong, fetchSong, setIsPlaying, audioRef } = useContext(SongContext);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const userID = user?.id;

  //call getQueue API
  const fetchQueue = useCallback(async (userID) => {
    if (!userID) {
      console.warn("User ID is missing.");
      return;
  }
    setLoading(true);
    setError(null);
    try {
        const response = await axiosInstance.get(`/queue?userID=${userID}`);
        const sortedQueue = response.data.data.sort((a, b) => a.position - b.position) || [];;
        setQueue(sortedQueue || []); 
        // Chỉ gán selectedSong là bài hát đầu tiên nếu chưa có selectedSong và bài hát hiện tại không có trong queue
        if (!selectedSong && sortedQueue.length > 0) {
          fetchSong(sortedQueue[0].Song.id);
        } else if (selectedSong && !sortedQueue.some(song => song.Song.id === selectedSong.id)) {
          fetchSong(sortedQueue[0].Song.id);
        } 
    } catch (error) {
        console.error("Failed to fetch queue:", error);
    } finally {
        setLoading(false);
    }
}, [selectedSong, fetchSong]);

  useEffect(() => {
    if (userID) {
      fetchQueue(userID);
    }
  }, [userID, fetchQueue]);

  const addSongToQueue = async (userID, songID) => {
    try {
      console.log("Sending request to add song:", { userID, songID });
      const response = await axiosInstance.post(`/queue/add`, { userID, songID });
      console.log("API Response:", response.data);
  
      await fetchQueue(userID); // Fetch lại queue
    } catch (err) {
      console.error("Failed to add song to queue:", err.response?.data || err.message);
    }
  };
  

  const shuffleQueue = async (userID, currentSongId) => {
    console.log("Shuffling queue with:", { userID, currentSongId });
    try {
      const response = await axiosInstance.post(`/queue/shuffle`, {
        userID,
        currentSongId,
      });
      const shuffledQueue = response.data.data.sort((a, b) => a.position - b.position);
      console.log("Queue shuffled:", shuffledQueue);
      setQueue(shuffledQueue || []);

      //Re-update 1st song
      const firstSong = shuffledQueue[0]?.Song;
      if (firstSong) {
          fetchSong(firstSong.id);
      }
    } catch (err) {
      console.error("Failed to shuffle queue:", err);
    }
  };

  const removeSongFromQueue = async (songID) => {
    if (!userID) return;
    try {
      await axiosInstance.delete(`/queue/remove`, {
        data: { userID, songID },
      });
      await fetchQueue(userID);
    } catch (err) {
      console.error("Failed to remove song from queue:", err);
    }
  };

  const clearQueue = async (userID) => {
    try {
      await axiosInstance.delete(`/queue/clear`, {
        data: { userID },
      });
      console.log("Queue cleared");
      setQueue([]);
    } catch (err) {
      console.error("Failed to clear queue:", err);
    }
  };

  const nowPlaying = (queue && selectedSong)
  ? queue.find((song) => song.Song && song.Song.id === selectedSong.id)
  : null;


  const remainingQueue = (queue && selectedSong)
  ? queue.filter((song) => song.Song && song.Song.id !== selectedSong.id)
  : [];

  const handleSongClick = async (songId, fetchSongCallback) => {
    if (selectedSong?.id === songId) {
      console.log("Song is already selected.");
      return;
    }
  
    try {
      console.log("Adding song to queue...");
  
      // Gọi API thêm bài hát vào queue trong DB
      await addSongToQueue(userID, songId);
  
      console.log("Song successfully added to queue in DB.");
  
      // Gọi lại fetchQueue để cập nhật hàng đợi trong UI
      await fetchQueue(userID);
      console.log("Queue updated from database.");
  
      // Fetch dữ liệu bài hát và cập nhật selectedSong
      if (fetchSongCallback) {
        await fetchSongCallback(songId);
        console.log("Song fetched and updated in UI.");
      }
    } catch (err) {
      console.error("Error in handleSongClick:", err.message);
    }
  };
  


  const toggleQueueVisibility = () => {
    setActiveComponent((prev) =>
        prev === "PlayerAction" ? "Queue" : "PlayerAction"
    );
};

  //next song
  const handleNextSong = async () => {
    if (!queue.length) {
      console.warn("Queue is empty.");
      return;
    }
  
    if (!selectedSong) {
      console.warn("No selected song.");
      return;
    }
  
    const currentIndex = queue.findIndex(
      (song) => song.Song && song.Song.id === selectedSong.id
    );
    console.log("Current index:", currentIndex);
  
    if (currentIndex === -1) {
      console.warn("-1 inedx");
      return;
    }
    //remove song from queue
    await removeSongFromQueue(selectedSong.id);

    //get next song
    const nextIndex = (currentIndex + 1) % queue.length;
    const nextSong = queue[nextIndex]?.Song;
  
    if (nextSong) {
      console.log("Next song found:", nextSong);
      await fetchSong(nextSong.id);

      //update queue
      const updatedQueue = [...queue];
      const currentSong = updatedQueue[currentIndex];
      updatedQueue.splice(currentIndex, 1);
      updatedQueue.push(currentSong);

      setQueue(updatedQueue);

      if (audioRef.current) {
        audioRef.current.play();
      }
      setIsPlaying(true);
    } else {
      console.warn("Next song not found in queue.");
    }
  };
  
  //prev song
  const handlePrevSong = () => {
    if (!queue.length) {
      console.warn("Queue is empty.");
      return;
    }
  
    if (!selectedSong) {
      console.warn("No selected song.");
      return;
    }
  
    const currentIndex = queue.findIndex(
      (song) => song.Song && song.Song.id === selectedSong.id
    );
  
    if (currentIndex === -1) {
      console.warn("Selected song not found in queue.");
      return;
    }
  
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prevSong = queue[prevIndex]?.Song;
  
    if (prevSong) {
      console.log("Previous song found:", prevSong);
      fetchSong(prevSong.id);
    } else {
      console.warn("Previous song not found in queue.");
    }
  };

  const preViewNextInQueue = () => {
    if(!queue.length){
      console.log("Queue is empty");
      return null;
    }

    if(!selectedSong){
      console.log("No selected song");
      return queue[0]?.Song;
    }

    const currentIndex = queue.findIndex(
      (song) => song.Song && song.Song.id === selectedSong.id
    );

    if(currentIndex === -1){
      console.log(" (-1) Selected song not found in queue");
      return null;
    }

    const nextIndex = (currentIndex + 1) % queue.length;
    return queue[nextIndex]?.Song || null;
  }

  const handleEndedSong = useCallback(async () => {
    if (!selectedSong || !userID) return;
    
    try {
        await removeSongFromQueue(selectedSong.id);
        if (queue.length > 1) {
            const nextSong = queue[1].Song;
            await fetchSong(nextSong.id);
        }
    } catch (error) {
        console.error('Error handling song end:', error);
    }
}, [selectedSong, queue, userID]);

  return (
    <QueueContext.Provider
      value={{
        queue,
        setQueue,
        activeComponent,
        toggleQueueVisibility,
        fetchQueue,
        addSongToQueue,
        shuffleQueue,
        removeSongFromQueue,
        clearQueue,
        nowPlaying,
        remainingQueue,
        handleNextSong,
        handlePrevSong,
        handleSongClick,
        preViewNextInQueue,
        handleEndedSong,
        loading,
        error,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};
