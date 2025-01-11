import "../styles/AlbumDetail.css";
import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useAlbum } from "../contexts/AlbumContext";
import { QueueContext } from "../contexts/QueueContext";
import { SongContext } from "../contexts/SongContext";
import { useFavourite } from '../contexts/FavouriteContext';

const AlbumDetail = () => {
  const { albumID } = useParams();
  const { album, albumDetail, loading, error } = useAlbum();
  const { fetchSong } = useContext(SongContext);
  const { handleSongClick } = useContext(QueueContext);
  const { isFavourite, toggleFavourite } = useFavourite();
    
    const handleFavouriteClick = async (e) => {
        e.stopPropagation();
        try {
            await toggleFavourite('album', albumID);
        } catch (error) {
            console.error('Error toggling album favorite:', error);
        }
    };

  useEffect(() => {
    if (albumID) {
      albumDetail(albumID);
    }
  }, [albumID]);
  useEffect(() => {
    if (album) {
      console.log("Album state updated:", album);
    }
  }, [album]);

  if (loading) return <p>Loading album details...</p>;
  if (error) return <p>{error}</p>;
  console.log(album);
  if (!album) return <p>No album details found.</p>;

  return (
    <div className="album-detail">
      <div className="album-header">
        <div className="album-img">
          <img
            src={album.imagePath}
            alt={album.title}
            className="album-image"
          />
        </div>
        <div className="album-infor">
          <h1>{album.title}</h1>
          <p>{album.Artist?.userName || "Unknown Artist"}</p>
        </div>
      </div>
      {/*Album action */}
      <div className="album-actions">
        <i className="bx bx-play-circle play-button"></i>
        <i className="bx bx-shuffle"></i>
        <i className="bx bx-download"></i>
        <i 
            className={`bx ${isFavourite('album', albumID) ? 'bxs-folder-plus active' : 'bx-folder-plus'}`}
            onClick={handleFavouriteClick}
        ></i>
      </div>

      {/* Danh sách bài hát */}
      <ul className="song-list">
        {album.songs.map((song, index) => (
          <li key={song.id} className="song-item" onClick={() => handleSongClick(song.id, fetchSong)}>
            <span className="song-index">{index + 1}</span>
            <img
              src={song.imagePath}
              alt={song.trackTitle}
              className="song-image"
            />
            <div className="song-info">
              <h4 className="song-title">{song.trackTitle}</h4>
              <p className="song-artist">
                {song.Artist?.userName || "Unknown Artist"}
                {song.Collaborators.length > 0 &&
                  song.Collaborators.map((collaborator, idx) => (
                    <span key={collaborator.id}>
                      {idx === 0 ? ", " : ""}
                      {collaborator.userName}
                    </span>
                  ))}
              </p>
            </div>
            <span className="song-plays">{album.plays || "0"} plays</span>
            <span className="song-duration">
              {Math.floor(song.duration / 60)}:
              {song.duration % 60 < 10 ? "0" : ""}
              {song.duration % 60}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumDetail;
