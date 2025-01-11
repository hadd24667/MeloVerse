import "../styles/PlayerAction.css";
import React, { useContext, useEffect } from "react";
import binhyen from "../assets/binhyen.jpg";
import { SongContext } from "../contexts/SongContext";
import { QueueContext } from "../contexts/QueueContext";
import { useFollow } from "../contexts/FollowContext";
import { useUser } from "../contexts/UserContext";

const PlayerAction = () => {
  const { selectedSong } = useContext(SongContext);
  const { isQueueVisible } = useContext(SongContext);
  const { preViewNextInQueue } = useContext(QueueContext);
  const nextSong = preViewNextInQueue();

  const { fetchFollowingArtists, followingArtists, followArtist, unfollowArtist } = useFollow();
  const { user } = useUser();
  const userID = user?.id;

  const isFollowing = selectedSong?.artistID && followingArtists.includes(selectedSong.artistID);

  useEffect(() => {
    if (user?.id) {
        fetchFollowingArtists(user.id); 
    }
}, [user]);
  const handleFollowToggle = async () => {
    if (!selectedSong || !selectedSong.artistID) {
      alert("No artist selected to follow/unfollow.");
      return;
    }
    try {
      if (isFollowing) {
        await unfollowArtist(userID, selectedSong.artistID);
      } else {
        await followArtist(userID, selectedSong.artistID);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (isQueueVisible) {
    return null;
  }

  if (!selectedSong) {
    return (
      <div className="top-section">
        <div className="header">
          <h5>Player</h5>
          <i className="bx bxs-playlist"></i>
        </div>
        <div className="song-info">
          <p>No song selected</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="top-section">
        <div className="header">
          <h5>Player</h5>
          <i className="bx bxs-playlist"></i>
        </div>
        <div className="song-info">
          <img src={selectedSong.imagePath} alt="Song Image" />
          <div className="description">
            <h3>{selectedSong.trackTitle}</h3>
            <h5>{selectedSong.artist}</h5>
          </div>
        </div>
        <div className="artist-info">
          <img src={selectedSong.artistImage} alt="Song Image" />
          <div className="description">
            <h3>{selectedSong.artistName}</h3>
            <h5 style={{ color: "rgb(144, 143, 143)" }}>
              <span className="followers-count">
                {selectedSong.followerCount}
              </span>{" "}
              followers
            </h5>
            <button
              className={`follow-button ${isFollowing ? "is-following" : ""}`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>
        <div className="next-song">
          <h5>Next in queue</h5>
          <div className="next-song-content">
            <img src={nextSong?.imagePath || binhyen} alt="music avt" />
            <div className="song-details">
              <h6>
                <span>{nextSong?.trackTitle || "Song Title"}</span>
              </h6>
              <p>
                <span>{nextSong?.Artist?.userName || "Artist Name"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerAction;
