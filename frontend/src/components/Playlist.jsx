import React, { useState, useEffect, useContext } from "react";
import { usePlaylist } from "../contexts/PlaylistContext";
import "../styles/Playlist.css";
import { formatDuration } from "../utils/formatDuration";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import EditPlaylistModal from "./EditPlaylistModal";
import { SongContext } from "../contexts/SongContext";
import { QueueContext } from "../contexts/QueueContext";
import defaultPlaylistImage from "../../public/assets/playlist-default.png";

const Playlist = () => {
  const { playlistID } = useParams();
  const { fetchSong } = useContext(SongContext);
  const { handleSongClick } = useContext(QueueContext);
  const {
    currentPlaylist,
    setCurrentPlaylist,
    playlistSongs,
    getPlaylistSongs,
    searchSongs,
    addSongToPlaylist,
    getPlaylistDetails
  } = usePlaylist();

  console.log("currentPlaylist:", currentPlaylist);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Lấy danh sách bài hát của playlist hiện tại
  useEffect(() => {
    // Nếu chưa có `currentPlaylist`, lấy thông tin từ `playlistID`
    if (!currentPlaylist || currentPlaylist.id !== Number(playlistID)) {
      setCurrentPlaylist({ id: Number(playlistID), title: `Playlist #${playlistID}` }); // Cập nhật tiêu đề tạm thời
      getPlaylistSongs(Number(playlistID)); // Lấy danh sách bài hát từ API
    }
  }, [playlistID, currentPlaylist, setCurrentPlaylist, getPlaylistSongs]);

  // Xử lý tìm kiếm bài hát
  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      try {
        const results = await searchSongs(e.target.value);
        setSearchResults(results);
        console.log("Search results:", results);
      } catch (error) {
        console.error("Failed to search songs:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Thêm bài hát vào playlist
  const handleAddSong = async (song) => {
    try {
      await addSongToPlaylist(currentPlaylist.id, song.id);
      await getPlaylistSongs(currentPlaylist.id);
      setSearch("");
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to add song to playlist:", error);
    }
  };

    useEffect(() => {
      const loadPlaylist = async () => {
          try {
              if (playlistID) {
                  await getPlaylistDetails(Number(playlistID));
              }
          } catch (error) {
              console.error("Failed to load playlist:", error);
          }
      };
      loadPlaylist();
  }, [playlistID]); // Remove currentPlaylist from dependencies

  if (!currentPlaylist) {
    return <p>No playlist selected. Please select or create a playlist.</p>;
  }

  return (
    <div className="playlist-container">
      <div className="playlist-header">
        <img
          className="playlist-header-image"
          src={currentPlaylist?.imagePath || defaultPlaylistImage}
          alt="Playlist Cover"
        />
        <div className="playlist-info">
          <h1>{currentPlaylist.title}</h1>
          <p>{user.userName}</p>
        </div>
      </div>
      <div className="playlist-actions">
        <i className="bx bx-play-circle play-button"></i>
        <i className="bx bx-shuffle"></i>
        <i className="bx bx-download"></i>
        <i
          className="bx bx-edit-alt"
          onClick={() => setIsEditModalOpen(true)} // Mở modal khi nhấn "Edit"
        ></i>
      </div>
      <EditPlaylistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        playlist={currentPlaylist}
      />
      <div className="playlist-song-list">
        {playlistSongs.map((song, index) => (
          <div className="playlist-song-item" key={index} onClick={() => handleSongClick(song.id, fetchSong)}>
            <img
              className="playlist-song-image"
              src={song.imagePath}
              alt={song.trackTitle}
            />
            <div className="playlist-song-info">
              <div className="playlist-song-main-info">
                <span className="playlist-song-title">{song.trackTitle}</span>
                <span className="playlist-song-artist">{song.Artist?.userName}</span>
              </div>
              <span className="playlist-song-duration">{formatDuration(song.duration)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="search-divider"></div>

      <div className="playlist-search">
        <i className="bx bx-search"></i>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search for a song to add"
        />
        <div className="playlist-search-results">
          {searchResults.map((song, index) => (
            <div
              className="playlist-search-result-item"
              key={index}
              onClick={() => handleAddSong(song)}
            >
              <img
                className="playlist-search-result-image"
                src={song.imagePath}
                alt={song.trackTitle}
              />
              <div className="playlist-search-result-info">
                <span className="playlist-search-result-title">
                  {song.trackTitle}
                </span>
                <span className="playlist-search-result-artist">
                  {song.Artist.userName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
