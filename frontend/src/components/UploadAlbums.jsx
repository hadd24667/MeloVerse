import React, { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import TrackForm from "../components/Artist/TrackForm";
import TrackItem from "../components/Artist/TrackItem";
import useFetchAllArtists from "../hooks/Artist/useFetchAllArtists.js";
import { uploadMusic, uploadImage } from '../services/UploadService.js';
import Instance from '../config/axiosCustomize';
import LoadingOverlay from '../components/LoadingOverlay';
import "../styles/scrollbar.css";

const UploadAlbums = () => {
    const [tracks, setTracks] = useState([]);
    const [albumCover, setAlbumCover] = useState(null);
    const [albumTitle, setAlbumTitle] = useState("");
    const [albumDescription, setAlbumDescription] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [editingTrackIndex, setEditingTrackIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const {user} = useUser();

    const { allArtist, loading, error } = useFetchAllArtists();

    const addTrack = () => {
        if (tracks.length > 0) {
            const lastTrack = tracks[tracks.length - 1];
            if (!lastTrack.title || !lastTrack.image || !lastTrack.audio || !lastTrack.genre) {
                alert("Please fill in all required fields for the last track before adding a new one.");
                return;
            }
        }
        const newTrack = { title: "", image: null, audio: null, position: tracks.length + 1, genre: "", artists: [] , lyrics: "", duration: 0 };
        setTracks([...tracks, newTrack]);
        setEditingTrackIndex(tracks.length);
        console.log(tracks)
    };

    const handleAlbumCoverChange = (e) => {
        setAlbumCover(e.target.files[0]);
    };

    const handleCreateAlbum = () => {
        if(!albumCover || !albumTitle || !albumDescription) {
            alert("Please fill in all required fields");
            return;
        }
        setShowForm(false);
        console.log("Album Cover:", albumCover, "Album Title:", albumTitle, "Album Description:", albumDescription);
    };

    const handleEditAlbum = () => {
        setShowForm(true);
    };

    const handleEditTrack = (index) => {
        setEditingTrackIndex(index);
    };

    const handleSaveTrack = () => {
        if(!tracks[editingTrackIndex].title || !tracks[editingTrackIndex].image || !tracks[editingTrackIndex].audio || !tracks[editingTrackIndex].genre) {
            alert("Please fill in all required fields");
            return;
        }
        setEditingTrackIndex(null);
    };

    const handleDeleteTrack = (index) => {
        const updatedTracks = tracks.filter((track, i) => i !== index);
        setTracks(adjustTrackPositions(updatedTracks));
    };

    const adjustTrackPositions = (tracks) => {
        return tracks.map((track, index) => ({
            ...track,
            position: index + 1,
        }));
    };

    const handleUpdateArtists = (index, selectedArtists) => {
        const updatedTracks = [...tracks];
        updatedTracks[index].artists = selectedArtists;
        setTracks(updatedTracks);
    };

    const handleUploadAlbum = async () => {
        setIsLoading(true); // Set loading state to true
        try {
            const imagePath = await uploadImage(albumCover);
            const updatedTracks = await Promise.all(tracks.map(async (track) => {
                const audioURL = track.audio ? await uploadMusic(track.audio) : null;
                const imageURL = track.image ? await uploadImage(track.image) : null;
                const artistIDs = track.artists.map(artist => artist.id); // Map artists to their IDs

                return {
                    ...track,
                    audio: audioURL,
                    image: imageURL,
                    artists: artistIDs, // Only include artist IDs
                };
            }));

            const albumData = {
                artist: user?.id,
                title: albumTitle,
                imagePath,
                releaseDate: new Date(),
                description: albumDescription,
                tracks: updatedTracks,
            };

            console.log("Album Data:", albumData); // Log the data being sent

            await Instance.post('/artist-upload-album', albumData);
            alert("Album uploaded successfully");
        } catch (error) {
            console.error("Error uploading album:", error);
            alert("Error uploading album");
        } finally {
            setIsLoading(false); // Set loading state to false
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="max-w-4xl mx-auto bg-black p-8 rounded-xl text-white flex gap-8 mt-24">
            {isLoading && <LoadingOverlay />} {/* Show LoadingOverlay when loading */}
            <div className="album-info w-1/2">
                <h2 className="text-3xl font-bold mb-6">Upload Album</h2>
                {showForm ? (
                    <div>
                        <div className="mb-4 flex-col items-center">
                            <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="albumCover">
                                Album Cover
                            </label>
                            <input
                                className="w-full py-2 bg-gray-800 bg-opacity-70 rounded-lg text-white file:bg-purple-500 file:text-white file:rounded-md file:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="file"
                                id="albumCover"
                                accept="image/*"
                                onChange={handleAlbumCoverChange}
                            />
                        </div>

                        <div className="gap-4 mb-4 flex-col items-center">
                            <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="albumTitle">
                                Album Title
                            </label>
                            <input
                                className="w-full py-3 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="text"
                                id="albumTitle"
                                placeholder="Enter album title"
                                value={albumTitle}
                                onChange={(e) => setAlbumTitle(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="albumDescription">
                                Album Description
                            </label>
                            <textarea
                                className="w-full py-3 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="text"
                                id="albumDescription"
                                placeholder="Enter a description for the album"
                                rows="4"
                                value={albumDescription}
                                onChange={(e) => setAlbumDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            onClick={handleCreateAlbum}
                            className="w-full py-3 bg-pink-200 text-black font-semibold rounded-lg transition"
                        >
                            Create Album
                        </button>
                    </div>
                ) : (
                    <div className="album-preview">
                        <div className="mb-4 flex items-center">
                            <div className="w-1/4 aspect-square rounded-lg overflow-hidden mr-4">
                                <img
                                    src={URL.createObjectURL(albumCover)}
                                    alt="Album Cover"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-left">
                                <h1 className="text-3xl font-semibold mb-2">{albumTitle}</h1>
                                <p className="text-sm">{albumDescription}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleEditAlbum}
                            className="py-3 px-6 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                        >
                            Edit Album
                        </button>
                        <div>
                            <button
                                onClick={handleUploadAlbum}
                                className="py-3 px-6 bg-pink-200 text-black font-semibold rounded-lg hover:bg-pink-50 transition mt-24"
                            >
                                Upload Album
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="track-list w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Tracks</h3>

                <div className="overflow-y-auto max-h-96 rounded-b">
                    {tracks.map((track, index) => (
                        <div key={index} className="mb-4 bg-gray-900 p-4 rounded-lg">
                            {editingTrackIndex === index ? (
                                <TrackForm
                                    track={track}
                                    index={index}
                                    tracks={tracks}
                                    setTracks={setTracks}
                                    handleSaveTrack={handleSaveTrack}
                                    artists={allArtist || []}
                                    updateArtists={handleUpdateArtists}
                                />
                            ) : (
                                <TrackItem
                                    track={track}
                                    index={index}
                                    handleEditTrack={handleEditTrack}
                                    handleDeleteTrack={handleDeleteTrack}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={addTrack}
                    className="w-full mt-8 py-3 bg-pink-50 text-black rounded-lg hover:bg-white transition"
                >
                    Add Track
                </button>
            </div>
        </div>
    );
};

export default UploadAlbums;