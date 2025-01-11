import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PLaylistList.css";
import { usePlaylist } from "../contexts/PlaylistContext";
import defaultPlaylistImage from "../../public/assets/playlist-default.png";
import { useUser } from "../contexts/UserContext";

const PlaylistList = () => {
  const navigate = useNavigate();
  const { playlists, getUserPlaylists, loading } = usePlaylist();
  const { user } = useUser();
  const userID = user?.id;

  useEffect(() => {
    if (userID) {
      getUserPlaylists(userID);
    }
  }, [userID]);

  const handlePlaylistClick = (playlistID) => {
    navigate(`/home/playlist/${playlistID}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="playlist-list">
      <div className="playlist-header">
        <div className="playlist-infor">
          <h1>Your Playlists</h1>
        </div>
      </div>
      <div className="playlist-items">
        {playlists.map((playlist) => (
          <div 
            className="playlist-item" 
            key={playlist.id}
            onClick={() => handlePlaylistClick(playlist.id)}
          >
            <img
              className="playlist-image"
              src={playlist.imagePath || defaultPlaylistImage}
              alt="playlist cover"
            />
            <div className="playlist-info">
              <div className="playlist-main-info">
                <span className="playlist-title">{playlist.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistList;
