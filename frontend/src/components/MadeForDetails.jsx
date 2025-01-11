import React, { useContext, useEffect } from "react";
import "../styles/Recent.css";
import { MadeForContext } from "../contexts/MadeForContext";
import { formatDuration } from "../utils/formatDuration";
import { QueueContext } from "../contexts/QueueContext";
import { SongContext } from "../contexts/SongContext";
import { useParams } from "react-router-dom";

const MadeForDetails = () => {
  const { mixType } = useParams();
  const { mixData, loading, fetchMixData, resetMixData } = useContext(MadeForContext);
  const { fetchSong } = useContext(SongContext);
  const { handleSongClick } = useContext(QueueContext);

  const mixFetchMap = {
    "vpop-mix": "vpop",
    "kpop-mix": "kpop",
    "edm-mix": "edm",
    "chilling-mix": "chill",
  }

  const mixNameMap = {
    "mega-mix": "Your MegaMix",
    "vpop-mix": "V-Pop Mix",
    "global-mix": "Top Global Mix",
    "kpop-mix": "K-Pop Mix",
    "edm-mix": "EDM Mix",
    "chilling-mix": "Chilling with Meloverse",
  };

  const mixImgMap = {
    "mega-mix": "../../public/assets/1.png",
    "vpop-mix": "../../public/assets/2.png",
    "global-mix": "../../public/assets/3.png",
    "kpop-mix": "../../public/assets/6.png",
    "edm-mix": "../../public/assets/5.png",
    "chilling-mix": "../../public/assets/4.png",
  }

  const backgroundColors = {
    "mega-mix": "linear-gradient(120deg, #c24396 0%, #141414 90%)",
    "vpop-mix": "linear-gradient(120deg, #006450 0%, #141414 90%)",
    "global-mix": "linear-gradient(120deg, #8400E7 0%, #141414 90%)",
    "kpop-mix": "linear-gradient(120deg, #E13300 0%, #141414 90%)",
    "edm-mix": "linear-gradient(120deg, #0D73EC 0%, #141414 90%)",
    "chilling-mix": "linear-gradient(120deg, #148A08 0%, #141414 90%)",
  };

  useEffect(() => {
    resetMixData();
    if (mixFetchMap[mixType]) {
      fetchMixData("genre-mix", mixFetchMap[mixType]);
      console.log("Fetching mix data for", mixType);
    } else {
      fetchMixData(mixType);
    }
  }, [mixType]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const mix = mixData["genre-mix"] || mixData[mixType] || {};
  const topListened = Array.isArray(mix.topListened) ? mix.topListened : [];
  const relatedSongs = Array.isArray(mix.relatedSongs) ? mix.relatedSongs : [];
  const combinedSongs = [...topListened, ...relatedSongs];

  return (
    <div className="recent-songs made-for" style={{ background: backgroundColors[mixType] }}>
      <div className="made-for-header">
        <div className="playlist-header">
          <img
            className="playlist-header-image"
            src={mixImgMap[mixType]}
            alt="Playlist Cover"
          />
          <div className="playlist-info">
            <h1>{mixNameMap[mixType]}</h1>
          </div>
        </div>
        <div className="playlist-actions made-for-actions">
          <i className="bx bx-play-circle play-button"></i>
          <i className="bx bx-shuffle"></i>
          <i className="bx bx-heart"></i>
        </div>
      </div>

      <div className="recent-song-list">
        {combinedSongs.map((song) => (
          <div
            className="recent-song-item"
            key={song.id}
            onClick={() => handleSongClick(song.id, fetchSong)}
          >
            <img
              className="recent-song-image"
              src={song.imagePath}
              alt="song cover"
            />
            <div className="recent-song-info">
              <div className="recent-song-main-info">
                <span className="recent-song-title">{song.trackTitle}</span>
                <span className="recent-song-artist">{song.Artist.userName}</span>
              </div>
            </div>
            <span className="recent-song-duration">
              {formatDuration(song.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MadeForDetails;