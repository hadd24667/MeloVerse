import React, { useEffect, useState, useRef } from "react";
import "../styles/ArtistsHome.css";
import { useUser } from "../contexts/UserContext.jsx";
import Instance from "../config/axiosCustomize.js";
import { useNavigate } from "react-router-dom";

const ArtistsHome = () => {
    const { user } = useUser();
    const [followers, setFollowers] = useState(0);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentTime, setCurrentTime] = useState("00:00");
    const [totalTime, setTotalTime] = useState("00:00");
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const navigate = useNavigate();

    const space = " ";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fl = await Instance.post("/get-followers", {
                    artistID: user.id,
                });
                setFollowers(fl.data);

                const as = await Instance.post("/get-artist-songs", {
                    artistID: user.id,
                });
                setSongs(as.data);

                const al = await Instance.post("/get-all-artist-albums", {
                    artistID: user.id,
                });
                setAlbums(al.data);
            } catch (error) {
                console.log(error);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleSongClick = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.src = song.filePath;
            audioRef.current.play();
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(formatTime(audioRef.current.currentTime));
            setTotalTime(formatTime(audioRef.current.duration));
        }
    };

    const handleEditProfile = () => {
        navigate('/profile');
    };

    return (
        <div className="main-home">
            <div className="artists-profile">
                <div className="artists-img">
                    <img src={user?.imagePath || '../../public/assets/avatar.jpg'} alt="User profile"/>
                </div>
                <div className="info">
                    <h2>{user?.userName}</h2>
                    <h3>{followers} Follower</h3>
                    <h3>{user?.profile || 'This artist has no description yet.'}</h3>
                </div>
            </div>
            <br/>
            <div
                className="py-2 flex items-center space-x-2 ml-20"
                onClick={handleEditProfile}
            >
                <img
                    src="https://icons.veryicon.com/png/o/miscellaneous/commonly-used-icon-1/modify-pen.png"
                    className="w-12 h-12 fill-white"
                    alt="Edit profile"
                />
                <span className="text-white hover:underline ">Edit Profile</span>
            </div>
            <hr
                style={{borderColor: "#e4afc5", borderWidth: "1px", margin: "0 90px"}}
            />
            <h2
                style={{
                    color: "aliceblue",
                    marginBottom: "20px",
                    marginTop: "20px",
                    marginLeft: "90px",
                }}
            >
                Your Song
            </h2>
            <div className="recently-song">
                <div className="items">
                    {songs.map((song, index) => (
                        <div className="item" key={index} onClick={() => handleSongClick(song)}>
                            <img src={song.imagePath || "assets/default.jpg"} alt={song.trackTitle}/>
                            <h5>{song.trackTitle}</h5>
                        </div>
                    ))}
                </div>
            </div>
            <h2
                style={{
                    color: "aliceblue",
                    marginBottom: "20px",
                    marginTop: "20px",
                    marginLeft: "90px",
                }}
            >
                Your Album
            </h2>
            <div className="recently-song recently-album">
                <div className="items">
                    {albums.map((album, index) => (
                        <div className="item" key={index}>
                            <a href="/artists/manage-songs-albums">
                                <img src={album.imagePath || "assets/default.jpg"} alt={album.title}/>
                            </a>
                            <h5>{album.title}</h5>
                        </div>
                    ))}
                </div>
            </div>
            <footer className="music-control-footer">
                <audio ref={audioRef} onTimeUpdate={handleTimeUpdate}/>
                <div className="music-controls">
                    <button className="control-btn"
                            onClick={() => audioRef.current && audioRef.current.currentTime > 0 && (audioRef.current.currentTime -= 10)}>
                        <i className="bx bx-skip-previous"></i>
                    </button>
                    <button className="control-btn play-btn" onClick={handlePlayPause}>
                        <i className={`bx ${isPlaying ? "bx-pause" : "bx-play"}`}></i>
                    </button>
                    <button className="control-btn"
                            onClick={() => audioRef.current && audioRef.current.currentTime < audioRef.current.duration && (audioRef.current.currentTime += 10)}>
                        <i className="bx bx-skip-next"></i>
                    </button>
                </div>
                <div className="progress-container">
                    <span className="current-time">{currentTime}</span>
                    <div className="progress-bar">
                        <div className="progress-art"
                             style={{width: `${(audioRef.current ? (audioRef.current.currentTime / audioRef.current.duration) * 100 : 0)}%`}}></div>
                    </div>
                    <span className="total-time">{totalTime}</span>
                </div>
                <div className="track-title">
                    {currentSong && <span>{currentSong.trackTitle}</span>}
                </div>
            </footer>
        </div>
    );
};

export default ArtistsHome;