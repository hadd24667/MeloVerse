import React, { useContext } from "react";
import "../styles/FavouriteSong.css";
import { useFavourite } from "../contexts/FavouriteContext";
import { formatDuration } from "../utils/formatDuration";
import { QueueContext } from "../contexts/QueueContext";
import { SongContext } from "../contexts/SongContext";

const FavouriteSongs = () => {
  const { favourites } = useFavourite(); // Lấy danh sách yêu thích từ context
  const { fetchSong } = useContext(SongContext);
  const { handleSongClick } = useContext(QueueContext);

  // Lọc ra danh sách các bài hát yêu thích
  const favouriteSongs = favourites.filter((fav) => fav.songID && fav.song);

  return (
    <div className="favourite-songs">
      <div className="favourite-header">
        <div className="favourite-info">
          <h1>Favourite Songs</h1>
        </div>
      </div>
      <div className="favourite-song-list">
        {favouriteSongs.map((fav) => (
          <div
            className="favourite-song-item"
            key={fav.songID}
            onClick={() => handleSongClick(fav.song.id, fetchSong)}
          >
            <img
              className="favourite-song-image"
              src={fav.song.imagePath}
              alt="song cover"
            />
            <div className="favourite-song-info">
              <div className="favourite-song-main-info">
                <span className="favourite-song-title">{fav.song.trackTitle}</span>
                <span className="favourite-song-artist">{fav.song.Artist.userName}</span>
              </div>
            </div>
            <span className="favourite-song-duration">{formatDuration(fav.song.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouriteSongs;
