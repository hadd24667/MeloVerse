import React, { useState } from "react";
import "../styles/ArtistDetail.css";
import { useParams } from "react-router-dom";
import { ArtistContext } from "../contexts/ArtistContext";
import { useContext } from "react";
import { useEffect } from "react";
import { formatDuration } from "../utils/formatDuration";
import { SongContext } from "../contexts/SongContext";
import { QueueContext } from "../contexts/QueueContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useFavourite } from "../contexts/FavouriteContext";
import { useFollow } from "../contexts/FollowContext";
import { useUser } from "../contexts/UserContext";

const ArtistDetail = () => {
  const { artistID } = useParams();
  const { songs, loading, error, fetchArtistDetails, artistData } =
    useContext(ArtistContext);
  const { fetchSong } = useContext(SongContext);
  const { handleSongClick } = useContext(QueueContext);
  const { isFavourite, toggleFavourite } = useFavourite();
  const {
    followingArtists,
    followArtist,
    unfollowArtist,
    fetchFollowingArtists,
  } = useFollow();
  const { user } = useUser();
  const [followLoading, setFollowLoading] = useState(false);
  const isFollowing = followingArtists.includes(Number(artistID));

  // Gọi API để lấy danh sách bài hát khi component render
  useEffect(() => {
    console.log("ArtistID from URL:", artistID);
    fetchArtistDetails(artistID);
  }, [artistID]);

  useEffect(() => {
    if (user?.id) {
        fetchFollowingArtists(user.id);
    }
}, [user]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      await toggleFavourite("artist", artistID);
    } catch (error) {
      console.error("Error toggling artist favorite:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!user?.id) {
        alert('Please login to follow artists');
        return;
    }
    setFollowLoading(true);
    try {
        if (isFollowing) {
            await unfollowArtist(user.id, artistID);
        } else {
            await followArtist(user.id, artistID);
        }
        await fetchFollowingArtists(user.id);
    } catch (error) {
        console.error('Follow error:', error);
    } finally {
        setFollowLoading(false);
    }
};

  if (!artistData || !songs) return <p>Loading data...</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="artist-detail">
      <div
        className="artist-header"
        style={{ backgroundImage: `url(${artistData.imagePath})` }}
      >
        <div className="artist-info">
          <h1 className="artist-name">{artistData.userName}</h1>
          <p className="artist-followers">
            {artistData.followerCount ?? 0} followers
          </p>
          <div className="artist-actions">
            <i className="bx bx-play-circle play-button"></i>
            <i
              className={`bx ${
                isFavourite("artist", artistID)
                  ? "bxs-heart active"
                  : "bx-heart"
              }`}
              onClick={handleFavoriteClick}
            ></i>
            <i className="bx bx-shuffle"></i>
            <button 
                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
                disabled={followLoading}
            >
                {followLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </div>

      <div className="artist-songs">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className="song-item"
            onClick={() => handleSongClick(song.id, fetchSong)}
          >
            <div className="song-index">{index + 1}</div>
            <LazyLoadImage
              src={song.imagePath}
              alt={song.trackTitle}
              className="song-image"
            />

            <div className="song-details">{song.trackTitle}</div>
            <div className="song-listens">{song.plays ?? 0} listens</div>
            <div className="song-duration">{formatDuration(song.duration)}</div>
          </div>
        ))}
      </div>

      <div className="artist-bio">
        <img
          src={artistData.imagePath}
          alt={artistData.userName}
          className="artist-bio-image"
        />
        <p className="artist-bio-text">{artistData.profile}</p>
      </div>
    </div>
  );
};

export default ArtistDetail;
