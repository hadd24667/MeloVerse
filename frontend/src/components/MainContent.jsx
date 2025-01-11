import "../styles/MainContent.css";
import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../config/axiosCustomize";
import { formatDuration } from "../utils/formatDuration";
import { SongContext } from "../contexts/SongContext";
import { QueueContext } from "../contexts/QueueContext";
import { HistoryContext } from "../contexts/HistoryContext";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useFavourite } from "../contexts/FavouriteContext";
const MainContent = () => {
  const [top1Song, setTop1Song] = useState([]);
  const [top10Songs, setTop10Songs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const { isFavourite, toggleFavourite } = useFavourite();

  const { fetchSong } = useContext(SongContext);
  const { handleSongClick } = useContext(QueueContext);
  const { history } = useContext(HistoryContext);

  const mixTypeMap = {
    "Your MegaMix": "mega-mix",
    "V-Pop Mix": "vpop-mix",
    "Top Global Mix": "global-mix",
    "Chilling with Meloverse": "chilling-mix",
    "EDM Mix": "edm-mix",
    "K-Pop Mix": "kpop-mix",
  };

  const handleMixClick = (mixType) => {
    const apiRoute = mixTypeMap[mixType];
    if (apiRoute) {
      navigate(`/home/made-for/${apiRoute}`);
    } else {
      console.error("Invalid mix type");
    }
  };

  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/songs/top-songs");
        // console.log("API Response:", response.data);
        setTop1Song(response.data.top1);
        setTop10Songs(response.data.top10);
        console.log("Top 1 Song:", response.data.top1);
        console.log("Top 10 Songs:", response.data.top10);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch top songs");
      } finally {
        setLoading(false);
      }
    };
    fetchTopSongs();
  }, []);

  const handleFavouriteClick = async (songId, e) => {
    e.stopPropagation(); // Ngăn sự kiện lan lên cha
    try {
      await toggleFavourite("song", songId);
    } catch (error) {
      console.error("Error toggling favourite:", error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message || "Bug cuc manh"}</p>;

  return (
    <>
      <div className="trending">
        <div className="left">
          <div className="info">
            <h2>{top1Song?.trackTitle || "No Title Available"}</h2>
            <h4>{top1Song?.artist || "Unknown ArtistAdmin"}</h4>
            <h5>{top1Song?.plays || 0} plays</h5>
            <div className="buttons">
              <button onClick={() => handleSongClick(top1Song.id, fetchSong)}>
                Listen Now
              </button>
              <i
                className={`bx bxs-heart favourite ${
                  isFavourite("song", top1Song.id) ? "active" : ""
                }`}
                onClick={(e) => handleFavouriteClick(top1Song.id, e)}
              ></i>
            </div>
          </div>
        </div>
        <img src={top1Song?.imagePath} />
      </div>

      <div className="playlist">
        <div className="Made-for">
          <div className="header">
            <h5>Made for {user?.userName}</h5>
            <a href="#">See all</a>
          </div>

          <div className="items">
            <div
              className="item"
              onClick={() => handleMixClick("Your MegaMix")}
            >
              <p>Your MegaMix</p>
              <img src="assets/1.png" alt="" />
            </div>
            <div className="item" onClick={() => handleMixClick("V-Pop Mix")}>
              <p>V-Pop Mix</p>
              <img src="assets/2.png" alt="" />
            </div>
            <div
              className="item"
              onClick={() => handleMixClick("Top Global Mix")}
            >
              <p>Top Global Mix</p>
              <img src="assets/3.png" alt="" />
            </div>
            <div
              className="item"
              onClick={() => handleMixClick("Chilling with Meloverse")}
            >
              <p>Chilling with Meloverse</p>
              <img src="assets/4.png" alt="" />
            </div>
            <div className="item" onClick={() => handleMixClick("EDM Mix")}>
              <p>EDM Mix</p>
              <img src="assets/5.png" alt="" />
            </div>
            <div className="item" onClick={() => handleMixClick("K-Pop Mix")}>
              <p>K-Pop Mix</p>
              <img src="assets/6.png" alt="" />
            </div>
          </div>
        </div>

        <div className="music-list">
          <div className="header">
            <h5>Top Songs</h5>
          </div>
          <div className="items">
            {Array.isArray(top10Songs) &&
              top10Songs.map((top10Songs, index) => (
                <div
                  className="item"
                  key={top10Songs.id}
                  onClick={() => handleSongClick(top10Songs.id, fetchSong)}
                >
                  <div className="info">
                    <p className="ordinal">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <img
                      src={top10Songs.imagePath}
                      alt={top10Songs.trackTitle}
                    />
                    <div className="details">
                      <h5>{top10Songs.trackTitle}</h5>
                      <p>{top10Songs.artist}</p>
                    </div>
                  </div>
                  <div className="actions">
                    <p>
                      {top10Songs.duration
                        ? formatDuration(top10Songs.duration)
                        : "N/A"}
                    </p>
                    <div className="icon">
                      <i className="bx bxs-right-arrow"></i>
                    </div>
                    <i className="bx bxs-plus-square"></i>
                    <i
                      className={`bx bxs-heart add-fav ${
                        isFavourite("song", top10Songs.id) ? "active" : ""
                      }`}
                      onClick={(e) => handleFavouriteClick(top10Songs.id, e)}
                    ></i>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <h2
        style={{ color: "aliceblue", marginBottom: "20px", marginTop: "20px" }}
      >
        Recently played
      </h2>
      <div className="hobby-scroll">
        <div className="items">
          <div className="items">
            {history.map((historyItem) => (
              <div
                className="item"
                key={historyItem.id}
                onClick={() => handleSongClick(historyItem.song.id, fetchSong)}
              >
                <img src={historyItem.song.imagePath} alt="song cover" />
                <h5>{historyItem.song.trackTitle}</h5>
                <i className="bx bx-play play-icon"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <h2
        style={{ color: "aliceblue", marginBottom: "20px", marginTop: "20px" }}
      >
        Maybe you like
      </h2>
      <div className="hobby-scroll">
        <div className="items">
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
          <div className="item">
            <img src="assets/gianhu.jpg" alt="" />
            <h5>Giá Như</h5>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default MainContent;
