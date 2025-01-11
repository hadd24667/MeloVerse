import React, { useContext } from "react";
import "../styles/Recent.css";
import { HistoryContext } from "../contexts/HistoryContext";
import { formatDuration } from "../utils/formatDuration";
import { QueueContext } from "../contexts/QueueContext";
import { SongContext } from "../contexts/SongContext";

const RecentSongs = () => {
  const { history } = useContext(HistoryContext);
  const { fetchSong } = useContext(SongContext);
  const { handleSongClick } = useContext(QueueContext);
  return (
    <div className="recent-songs">
      <div className="recent-header">
        <div className="recent-info">
          <h1>Recent Songs</h1>
        </div>
      </div>  
      <div className="recent-song-list">
        {history.map((historyItem) => (
          <div className="recent-song-item" key={historyItem.id} onClick={() => handleSongClick(historyItem.song.id, fetchSong)}>
            <img className="recent-song-image" src={historyItem.song.imagePath} alt="song cover" />
            <div className="recent-song-info">
              <div className="recent-song-main-info">
                <span className="recent-song-title">{historyItem.song.trackTitle}</span>
                <span className="recent-song-artist">{historyItem.song.Artist.userName}</span>
              </div>
            </div>
            <span className="recent-song-duration">{formatDuration(historyItem.song.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSongs;