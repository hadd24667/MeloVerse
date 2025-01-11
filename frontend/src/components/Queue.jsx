import React, { useContext, useEffect, useRef } from "react";
import "../styles/Queue.css";
import { QueueContext } from "../contexts/QueueContext";
import { SongContext } from "../contexts/SongContext";
import { useUser } from "../contexts/UserContext.jsx";

const Queue = () => {
  const { queue, fetchQueue, nowPlaying, remainingQueue, addSongToQueue, handleSongClick, handleNextSong, handleEndedSong } = useContext(QueueContext);
  const { selectedSong, fetchSong } = useContext(SongContext);
  const { user } = useUser();
  const audioRef = useRef(null);

  const userID = user?.id;

  useEffect(() => {
    if (userID) {
      console.log("Fetching queue for userID:", userID);
      fetchQueue(userID);
    }
  }, [userID, fetchQueue]); 
  

  useEffect(() => {
    if(audioRef.current) {
      const handleEnded = () => {
        handleNextSong();
      };
      audioRef.current.addEvenListener('ended', handleEnded);

      return () => {
        if(audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [handleNextSong]);

  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.addEventListener('ended', handleEndedSong);
          return () => {
              audioRef.current?.removeEventListener('ended', handleEndedSong);
          };
      }
  }, [handleEndedSong]);
  
  if (!queue || queue.length === 0) {
    return <div>No songs in queue</div>;
  }

  if (!selectedSong) {
    return <div>No song selected</div>;
  }


  return (
    <div className="queue-container">
      <h2>Queue List</h2>

      {/* Now Playing */}
      {selectedSong && (
        <div className="queue-item now-playing">
          <div className="song-information">
            <img
              src={selectedSong.imagePath || "path/to/default/image.jpg"}
              alt={selectedSong.trackTitle || "No title"}
            />
            <div className="details">
              <h4>{selectedSong.trackTitle || "No title"}</h4>
              <p>{selectedSong.artistName || "Unknown Artist"}</p>
            </div>
          </div>
          <div className="now-playing-label">Now Playing</div>
        </div>
      )}

      {/* Queue List */}
      <div className="queue-list">
        {remainingQueue.map((song) => (
          <div
            key={song.id}
            className="queue-item"
            onClick={() => handleSongClick(song.Song.id, fetchSong)}
          >
            <div className="song-information">
              <img src={song.Song.imagePath} alt={song.Song.trackTitle} />
              <div className="details">
                <h4>{song.Song.trackTitle}</h4>
                <p>{song.Song.Artist?.userName || "Unknown Artist"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;
