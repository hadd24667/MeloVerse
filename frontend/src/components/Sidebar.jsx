import "../styles/Sidebar.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGenre } from "../contexts/GenreContext";
import logo from "../../../frontend/public/assets/logo.png";
import { Link } from "react-router-dom";
import { usePlaylist } from "../contexts/PlaylistContext";
import { useUser } from "../contexts/UserContext";
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [showPopcover, setShowPopcover] = useState(false);
  const { setSelectedGenre } = useGenre();
  const navigate = useNavigate();
  const { createPlaylist, setCurrentPlaylist } = usePlaylist();
  const { user } = useUser();
  const userID = user?.id;

  const handleCreatePlaylist = async () => {
    try {
      const newPlaylist = await createPlaylist(userID);
      setCurrentPlaylist(newPlaylist);
      navigate(`/home/playlist/${newPlaylist.id}`);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const togglePopcover = () => {
    setShowPopcover((prev) => !prev);
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setShowPopcover(false);
    navigate("/home/genres");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <i onClick={handleToggle} className="bx bx-library sidebar-toggle"></i>
      <div className="menu">
        <h5>Menu</h5>
        <ul>
          <li>
            <i className="bx bxs-volume-full"></i>
            <a
              onMouseEnter={() => setShowPopcover(true)}
              onMouseLeave={() => setShowPopcover(false)}
            >
              Genres
            </a>

            {showPopcover && (
              <div
                className="popcover"
                onMouseEnter={() => setShowPopcover(true)}
                onMouseLeave={() => setShowPopcover(false)}
              >
                <ul>
                  <li onClick={() => handleGenreClick("Vpop")}>V-Pop</li>
                  <li onClick={() => handleGenreClick("Kpop")}>K-Pop</li>
                  <li onClick={() => handleGenreClick("US-UK")}>US-UK</li>
                  <li onClick={() => handleGenreClick("EDM")}>EDM</li>
                  <li onClick={() => handleGenreClick("Vinahouse")}>
                    Vinahouse
                  </li>
                  <li onClick={() => handleGenreClick("Chill")}>Chill</li>
                  <li onClick={() => handleGenreClick("Ballad")}>Ballad</li>
                  <li onClick={() => handleGenreClick("Rap")}>Rap</li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <i className="bx bxs-album"></i>
            <Link to="/home/albums">Albums</Link>
          </li>
          <li>
            <i className="bx bxs-microphone"></i>
            <Link to="/home/artists-for-listener">Artist</Link>
          </li>
          <li>
          <i className='bx bxs-music'></i>
            <Link to="/home/fav-song">Songs</Link>
          </li>
        </ul>
      </div>

      <div className="menu">
        <h5>Library</h5>
        <ul>
          <li>
            <i className="bx bx-undo"></i>
            <Link to="recent-songs">Recents</Link>
          </li>
          <li>
            <i className="bx bxs-photo-album"></i>
            <Link to="album-favourites">Albums</Link>
          </li>
          <li>
            <i className="bx bx-headphone"></i>
            <Link to="artist-favourites">Artists</Link>
          </li>
          <li>
            <i className="bx bxs-folder"></i>
            <Link to="playlist-list">Playlists</Link>
          </li>
        </ul>
      </div>

      <div className="menu">
        <h5>Playlist</h5>
        <ul>
          <li onClick={handleCreatePlaylist}>
            <i className="bx bxs-plus-square"></i>
            <span>Create playlist</span>
          </li>
          <li>
            <i className="bx bxs-caret-right-circle"></i>
            <Link to="playlist-list">My Playlists</Link>
          </li>
          <li>
            <i className="bx bxs-caret-right-circle"></i>
            <a href="#">Nhac giat giat</a>
          </li>
          <li>
            <i className="bx bxs-caret-right-circle"></i>
            <a href="#">Nhac suy</a>
          </li>
        </ul>
      </div>
      <div className="premium">
        <h4>MeloVerse Premium</h4>
        <img src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default Sidebar;
