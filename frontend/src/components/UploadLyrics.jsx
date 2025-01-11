import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import Instance from "../config/axiosCustomize.js";
import "../styles/scrollbar.css";

const UploadLyrics = () => {
    const {user} = useUser();

    const [songs, setSongs] = useState([]);
    const [lyrics, setLyrics] = useState([]);
    const [minute, setMinute] = useState("");
    const [second, setSecond] = useState("");
    const [lyricText, setLyricText] = useState("");
    const [songTitle, setSongTitle] = useState("");
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);
    const [authorNames, setAuthorNames] = useState("");

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                console.log("Fetching songs for artist:", user?.id);
                const response = await Instance.post('/get-artist-songs', {
                    artistID: user?.id,
                });
                console.log(response.data)
                setSongs(response.data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };
        fetchSongs();
    }, [user]);

    const handleAddLyric = () => {
        const time = parseInt(minute) * 60 + parseFloat(second);
        if (isNaN(time) || !lyricText) {
            alert("Please enter valid time and lyrics!");
            return;
        }
        const newLyric = { time, text: lyricText };
        setLyrics((prevLyrics) => {
            const updatedLyrics = [...prevLyrics, newLyric];
            updatedLyrics.sort((a, b) => a.time - b.time);
            return updatedLyrics;
        });
        setMinute("");
        setSecond("");
        setLyricText("");
    };

    const handleDeleteLyric = (index) => {
        setLyrics((prevLyrics) => prevLyrics.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (lyrics.length === 0) {
            alert("No lyrics to save!");
            return;
        }

        const confirmSave = window.confirm("Are you sure you want to save the lyrics?");
        if (!confirmSave) {
            return;
        }

        const lrcContent = lyrics
            .map((lyric) => `[${Math.floor(lyric.time / 60).toString().padStart(2, '0')}:${(lyric.time % 60).toFixed(2).padStart(5, '0')}] ${lyric.text}`)
            .join("\n");

        try {
            await Instance.post('/update-lyrics', {
                songId: currentSong.id,
                lyrics: lrcContent,
            });
            alert("Lyrics saved successfully");

            // Update the song's lyrics in the songs state
            setSongs(prevSongs => prevSongs.map(song =>
                song.id === currentSong.id ? { ...song, lyrics: lrcContent } : song
            ));
        } catch (error) {
            console.error("Error saving lyrics:", error);
            alert("Error saving lyrics");
        }
    };

    const parseLRC = (lrc) => {
        const lines = lrc.split('\n');
        return lines.map(line => {
            const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
            if (match) {
                const time = parseInt(match[1]) * 60 + parseFloat(match[2]);
                const text = match[3].trim();
                return { time, text };
            }
            return null;
        }).filter(line => line !== null);
    };

    const handleSongSelect = (e) => {
        const selectedSong = songs.find(song => song.trackTitle === e.target.value);
        setSongTitle(e.target.value);
        setCurrentSong(selectedSong);
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (selectedSong.lyrics) {
            const parsedLyrics = parseLRC(selectedSong.lyrics);
            setLyrics(parsedLyrics);
        } else {
            setLyrics([]);
        }

        // Create the author names string
        const collaboratorNames = selectedSong.collaborators.map(collab => collab.userName).join(', ');
        let authorString = user?.userName;
        if(collaboratorNames.length > 0) {
             authorString = `${user?.userName}, ${collaboratorNames}`;
        }
        setAuthorNames(authorString);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleProgressClick = (e) => {
        const progressBar = e.target;
        const rect = progressBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newTime = (offsetX / progressBar.clientWidth) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleRewind = () => {
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleForward = () => {
        audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
        setCurrentTime(audioRef.current.currentTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-white p-6">
            <div className="max-w-4xl w-full flex bg-black bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-lg">
                <div className="w-1/2 pr-4 ">
                    <h2 className="text-4xl font-bold mb-8 text-center text-gradient bg-gradient-to-r from-purple-400 to-pink-500">
                        Enter Time and Lyrics
                    </h2>

                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="songSearch">
                            Search Song
                        </label>
                        <select
                            className="w-full h-10 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            id="songTitle"
                            value={songTitle}
                            onChange={handleSongSelect}
                        >
                            <option value="">----</option>
                            {songs.map((song) => (
                                <option key={song.id} value={song.trackTitle}>{song.trackTitle}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4 mb-4 justify-between">
                        <input
                            type="number"
                            placeholder="Minute"
                            value={minute}
                            onChange={(e) => setMinute(e.target.value)}
                            className="w-1/2 p-3 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-transform duration-150 ease-in-out transform hover:scale-105"
                        />
                        <input
                            type="number"
                            placeholder="Second"
                            value={second}
                            max={59.99}
                            onChange={(e) => setSecond(e.target.value)}
                            className="w-1/2 p-3 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-transform duration-150 ease-in-out transform hover:scale-105"
                        />
                    </div>
                    <textarea
                        rows="3"
                        placeholder="Enter lyrics"
                        value={lyricText}
                        maxLength={100}
                        onChange={(e) => setLyricText(e.target.value)}
                        className="w-full h-20 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-transform duration-150 ease-in-out transform hover:scale-105 mb-4"
                    />
                    <button
                        onClick={handleAddLyric}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Add Line
                    </button>
                    <ul className="mt-4 max-h-32 overflow-y-auto custom-scrollbar">
                        {lyrics.map((lyric, index) => (
                            <li key={index} className="flex justify-between p-2 border-b border-gray-700 text-white">
                                <span>
                                    [{Math.floor(lyric.time / 60).toString().padStart(2, '0')}:{(lyric.time % 60).toFixed(2).padStart(5, '0')}] {lyric.text}
                                </span>
                                <button
                                    className="flex justify-between rounded-lg font-semibold hover:scale-105 border-gray-700 text-black"
                                    onClick={() => handleDeleteLyric(index)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleSave}
                        className="w-full py-3 mt-4 bg-pink-200 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-teal-500 hover:to-green-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Save Lyrics
                    </button>
                </div>

                <div className="w-1/2 pl-4 flex flex-col items-center">
                    <h2 className="text-4xl font-bold mb-8 text-center text-gradient bg-gradient-to-r from-purple-400 to-pink-500">
                        Your Song
                    </h2>

                    {currentSong && (
                        <>
                            <img src={currentSong.imagePath}
                                 alt="Song Thumbnail" className="mb-4 rounded-lg w-2/3 max-h-72 object-cover"/>

                            <div className="text-center mb-4">
                                <h3 className="text-2xl font-semibold mb-2">{currentSong.trackTitle}</h3>
                                <p className="text-lg text-gray-400">{authorNames}</p>
                            </div>

                            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mb-4 relative" onClick={handleProgressClick}>
                                <div
                                    className="bg-pink-200 h-full"
                                    style={{
                                        width: `${(currentTime / audioRef.current?.duration) * 100}%`,
                                    }}
                                ></div>
                                <div
                                    className="absolute top-0 h-4 w-4 bg-white rounded-b-sm transform -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                        left: `${(currentTime / audioRef.current?.duration) * 100}%`,
                                    }}
                                ></div>
                            </div>

                            <div className="flex justify-between w-full text-gray-400 mb-4">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(audioRef.current?.duration || 0)}</span>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center">
                                <button
                                    onClick={handleRewind}
                                    className="py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Rewind 5s
                                </button>
                                <button
                                    onClick={handlePlayPause}
                                    className="py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                                >
                                    {isPlaying ? "Pause Music" : "Play Music"}
                                </button>
                                <button
                                    onClick={handleForward}
                                    className="py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Forward 5s
                                </button>
                            </div>

                            <audio
                                ref={audioRef}
                                src={currentSong?.filePath}
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={() => setIsPlaying(false)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadLyrics;