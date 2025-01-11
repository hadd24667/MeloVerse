import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PlayerControl.css";
import { SongContext } from "../contexts/SongContext";
import { QueueContext } from "../contexts/QueueContext";
import { useUser } from "../contexts/UserContext";
import { useFavourite } from "../contexts/FavouriteContext";

const PlayerControl = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const userID = user?.id;
  const { isFavourite, toggleFavourite } = useFavourite();

  const {
    selectedSong,
    currentTime,
    setCurrentTime,
    duration,
    isPlaying,
    audioRef,
    togglePlayPause,
    updateTime,
    saveInitialHistory,
    updateListenTime,
  } = useContext(SongContext);

  const [isDragging, setIsDragging] = useState(false);
  const [tempTime, setTempTime] = useState(currentTime);
  const [showLyrics, setShowLyrics] = useState(false);
  const [listenInterval, setListenInterval] = useState(null);
  const {
    toggleQueueVisibility,
    shuffleQueue,
    fetchQueue,
    queue,
    handleNextSong,
    handlePrevSong,
  } = useContext(QueueContext);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    console.log("selectedSong changed:", selectedSong);
    console.log("userID changed:", userID);
    if (selectedSong && userID) {
      saveInitialHistory(selectedSong.id, userID);
    }
  }, [selectedSong, userID]);

  const handleLyrics = () => {
    if (showLyrics) {
      navigate(-1);
    } else {
      navigate("/home/lyrics");
    }
    setShowLyrics(!showLyrics);
  };

  const handleQueue = () => {
    setIsActive(!isActive);
    toggleQueueVisibility();
  };

  const handleShuffle = async () => {
    if (!userID || !userID) {
      console.error("Error: UserID is not available.");
      alert("UserID is missing. Please log in.");
      return;
    }
    await shuffleQueue(userID, selectedSong.id);

    if (isActive) {
      toggleQueueVisibility();
      setTimeout(() => toggleQueueVisibility(), 0);
      fetchQueue(userID);
    }
  };

  // Cập nhật màu thanh progress
  useEffect(() => {
    if (!isDragging) {
      const percent = (currentTime / duration) * 100;
      const progressBar = document.querySelector(".progress-bar");
      if (progressBar) {
        progressBar.style.background = `linear-gradient(to right, #f59ccd ${percent}%, #505050 ${percent}%)`;
      }
    }
  }, [currentTime, duration, isDragging]);

  const handleProgressMouseDown = () => setIsDragging(true);
  // Cập nhật thời gian tạm thời khi kéo
  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setTempTime(newTime);
  };

  // Cập nhật thời gian thực khi thả chuột
  const handleProgressMouseUp = (e) => {
    const newTime = (e.target.value / 100) * duration;
    updateTime(newTime);
    setIsDragging(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      const handleSongEnd = () => {
        console.log("Song ended, updating listen time");
        updateListenTime(
          selectedSong.id,
          userID,
          Math.floor(audioRef.current.currentTime)
        );
        handleNextSong();
        togglePlayPause();
      };

      audioRef.current.addEventListener("ended", handleSongEnd);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", handleSongEnd);
        }
      };
    }
  }, [
    audioRef,
    selectedSong,
    userID,
    updateListenTime,
    handleNextSong,
    togglePlayPause,
    queue,
    isPlaying,
    currentTime,
  ]);

  const handleNext = () => {
    if (selectedSong && userID) {
      console.log("Next song, updating listen time");
      updateListenTime(
        selectedSong.id,
        userID,
        Math.floor(audioRef.current.currentTime)
      );
    }
    handleNextSong();
    if (isPlaying) {
      clearInterval(listenInterval);
      const interval = setInterval(() => {
        setCurrentTime(audioRef.current.currentTime);
      }, 1000);
      setListenInterval(interval);
    }
  };

  const handlePrev = () => {
    if (selectedSong && userID) {
      updateListenTime(
        selectedSong.id,
        userID,
        Math.floor(audioRef.current.currentTime)
      );
    }
    handlePrevSong();
    if (isPlaying) {
      clearInterval(listenInterval);
      const interval = setInterval(() => {
        setCurrentTime(audioRef.current.currentTime);
      }, 1000);
      setListenInterval(interval);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFavouriteClick = async (songId, e) => {
    e.stopPropagation(); // Ngăn sự kiện lan lên cha
    try {
      await toggleFavourite("song", songId);
    } catch (error) {
      console.error("Error toggling favourite:", error.message);
    }
  };

  if (!selectedSong) {
    return (
      <div className="present-music">
        <img src="../../public/assets/logo.png" alt="Default" />
        <div className="song-details">
          <h4>Unknown Title</h4>
          <p>Unknown Artist</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="present-music">
        <img src={selectedSong.imagePath} alt="music avt" />
        <div className="song-details">
          <h4>{selectedSong.trackTitle}</h4>
          <p>{selectedSong.artistName}</p>
        </div>
      </div>
      <div className="buttons-and-progress">
        <div className="buttons">
          <i className="bx bx-repeat"></i>
          <i className="bx bx-first-page" onClick={handlePrev}></i>
          <div
            className="play-button"
            onClick={() => {
              console.log("Play/Pause button clicked");
              togglePlayPause();
            }}
          >
            <i
              className={`${
                isPlaying ? "bx bx-pause playing" : "bx bxs-right-arrow"
              }`}
            ></i>
          </div>

          <i className="bx bx-last-page" onClick={handleNext}></i>
          <i className="bx bx-transfer-alt" onClick={handleShuffle}></i>
        </div>
        <div className="progress">
          <p>{formatTime(currentTime)}</p>
          <input
            type="range"
            className="progress-bar"
            value={
              ((isDragging ? tempTime : currentTime) / duration) * 100 || 0
            }
            onMouseDown={handleProgressMouseDown}
            onChange={handleProgressChange}
            onMouseUp={handleProgressMouseUp}
          />
          <p>{formatTime(duration)}</p>
        </div>
      </div>
      <div className="controls">
        <i
          className={`bx bxs-heart add-fav ${
            isFavourite("song", selectedSong.id) ? "active" : ""
          }`}
          onClick={(e) => handleFavouriteClick(selectedSong.id, e)}
        ></i>
        <i className="bx bx-cloud-download download"></i>
        <i
          className={`bx bxl-tumblr lyric ${showLyrics ? "active" : ""}`}
          onClick={handleLyrics}
        ></i>
        <i
          className={`bx bxs-playlist queue ${isActive ? "active" : ""}`}
          onClick={handleQueue}
        ></i>
        <i
          className={`bx ${
            isMuted ? "bxs-volume-mute" : "bxs-volume-full"
          } volume`}
          onClick={toggleMute}
        ></i>
      </div>
    </>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default PlayerControl;
