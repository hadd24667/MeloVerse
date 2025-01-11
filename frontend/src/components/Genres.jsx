import React, { useEffect, useContext } from "react";
import { useGenre } from "../contexts/GenreContext";
import "../styles/Genres.css";
import { formatDuration } from "../utils/formatDuration";
import { SongContext } from "../contexts/SongContext";

const Genres = () => {
  const { selectedGenre, fetchSongByGenre, songs, loading, error } = useGenre();
  const { fetchSong } = useContext(SongContext);


  useEffect(() => {
    if (selectedGenre) fetchSongByGenre(selectedGenre);
  }, [selectedGenre]);
  console.log('Songs:', songs);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="genres-container">
      <div className="genre-title">
        <h1>{selectedGenre}</h1>
      </div>

      <div className="music-list">
        <div className="music-header">
          <h5>Top Songs of {selectedGenre}</h5>
          <a href="#" className="see-all-link">
            See all
          </a>
        </div>

        <div className="songs-list">
          {Array.isArray(songs) && songs.length > 0 ? (
            songs.map((song, index) => (
              <div 
              key={index} 
              className="song-item"
              onClick={() => fetchSong(song.id)}>
                <div className="song-info">
                  <p className="song-number">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </p>
                  <img
                    src={song.imagePath|| "/default.jpg"}
                    alt={song.trackTitle}
                    className="song-image"
                  />
                  <div>
                    <h5 className="song-title">
                      {song.trackTitle || "Unknown Song"}
                    </h5>
                    <p className="song-artist">
                      {song.Artist?.userName || "Unknown Artist"}
                    </p>
                  </div>
                </div>
                <div className="song-actions">
                  <p className="song-duration">{formatDuration(song.duration) || "0:00"}</p>
                  <button className="action-button">
                    <i className="bx bxs-right-arrow"></i>
                  </button>
                  <button className="action-button">
                    <i className="bx bxs-plus-square"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No songs available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Genres;
