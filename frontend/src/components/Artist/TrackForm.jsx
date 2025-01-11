import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ArtistSearchList from "./ArtistSearchList";
import {
    handleChange,
    handleFileChange,
    handleSearchChange,
    handleArtistSelect,
    handleRemoveArtist
} from "../../utils/trackUtils";
import { uploadLyrics } from "../../services/UploadService";
import { getDuration } from "../../utils/durationUtils";

const TrackForm = ({ track, index, tracks, setTracks, handleSaveTrack, artists = [], updateArtists }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedArtists, setSelectedArtists] = useState(track.artists || []);

    useEffect(() => {
        updateArtists(index, selectedArtists);
    }, [selectedArtists]);

    const filteredArtists = artists
        .filter((artist) => artist.userName && artist.userName.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((artist) => !selectedArtists.some(selected => selected.id === artist.id));

    const handleFileChangeExtended = async (e, field) => {
        const file = e.target.files[0];
        if (field === "lyrics") {
            const lyricsContent = await uploadLyrics(file);
            handleChange({ target: { value: lyricsContent } }, "lyrics", index, tracks, setTracks);
        } else if (field === "audio") {
            const duration = await getDuration(file);
            handleChange({ target: { value: duration } }, "duration", index, tracks, setTracks);
            handleFileChange(e, field, index, tracks, setTracks);
        } else {
            handleFileChange(e, field, index, tracks, setTracks);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Track Title"
                value={track.title}
                onChange={(e) => handleChange(e, "title", index, tracks, setTracks)}
                className="w-full mb-2 py-2 px-1 bg-gray-700 text-white rounded-lg"
            />
            <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="uploadImage">
                    Upload Track Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChangeExtended(e, "image")}
                    className="w-full mb-2 py-2 px-1 bg-gray-700 text-white rounded-lg"
                />
            </div>
            <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="uploadAudio">
                    Upload Audio File
                </label>
                <input
                    type="file"
                    accept="audio/mp3"
                    onChange={(e) => handleFileChangeExtended(e, "audio")}
                    className="w-full py-2 px-1 bg-gray-700 text-white rounded-lg"
                />
            </div>
            <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="uploadLyrics">
                    Upload Lyrics (.lrc)
                </label>
                <input
                    type="file"
                    accept=".lrc"
                    onChange={(e) => handleFileChangeExtended(e, "lyrics")}
                    className="w-full py-2 px-1 bg-gray-700 text-white rounded-lg"
                />
            </div>
            <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="trackGenres">
                    Genres
                </label>
                <select
                    name="trackGenres"
                    id="trackGenres"
                    value={track.genre || ""}
                    onChange={(e) => handleChange(e, "genre", index, tracks, setTracks)}
                    className="w-full p-3 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">-- Select Genre --</option>
                    <option value="vpop">Vpop</option>
                    <option value="kpop">Kpop</option>
                    <option value="us-uk">US-UK</option>
                    <option value="edm">EDM</option>
                    <option value="vinahouse">Vinahouse</option>
                    <option value="chill">Chill</option>
                    <option value="ballad">Ballad</option>
                    <option value="rap">Rap</option>
                </select>
            </div>
            <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="trackArtist">
                    Collaborators
                </label>
                <input
                    type="text"
                    placeholder="Search for an artist"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e, setSearchQuery)}
                    className="w-full p-3 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {searchQuery && (
                    <ArtistSearchList
                        artists={filteredArtists}
                        onSelect={(artist) => handleArtistSelect(artist, setSelectedArtists, setSearchQuery)}
                    />
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedArtists.map((artist) => (
                        <div key={artist.id} className="flex items-center space-x-2 bg-gray-800 rounded-full px-3 py-1">
                            <img src={artist.imagePath} alt={artist.userName} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-white">{artist.userName}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveArtist(artist.id, setSelectedArtists)}
                                className="text-black bg-white rounded-full w-4 h-4 flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={handleSaveTrack}
                className="w-full mt-8 py-3 font-semibold bg-white text-black rounded-lg transition"
            >
                Save Track
            </button>
        </div>
    );
};

TrackForm.propTypes = {
    track: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    tracks: PropTypes.array.isRequired,
    setTracks: PropTypes.func.isRequired,
    handleSaveTrack: PropTypes.func.isRequired,
    artists: PropTypes.array,
    updateArtists: PropTypes.func.isRequired,
};

export default TrackForm;