import React, { useState } from "react";
import { uploadMusic, uploadLyrics, uploadImage } from '../services/UploadService.js';
import ArtistSearchList from "./Artist/ArtistSearchList.jsx";
import { handleSearchChange, handleArtistSelect, handleRemoveArtist } from "../utils/trackUtils.js";
import { useUser } from "../contexts/UserContext.jsx";
import useFetchAllArtists from "../hooks/Artist/useFetchAllArtists.js";
import LoadingOverlay from '../../src/components/LoadingOverlay';
import { getDuration } from '../utils/durationUtils.js';
import Instance from '../config/axiosCustomize';

const UploadTracks = () => {
  const {user} = useUser();
  const { allArtist, loading, error } = useFetchAllArtists();

  const [trackTitle, setTrackTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [lyricsFile, setLyricsFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [duration, setDuration] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtists, setSelectedArtists] = useState([]);

  const handleMusicChange = async (event) => {
    const file = event.target.files[0];
    setMusicFile(file);
    try {
      const duration = await getDuration(file);
      setDuration(duration);
      console.log("Duration:", duration);
    } catch (error) {
      console.error("Error calculating duration:", error);
    }
  };

  const handleLyricsChange = (event) => setLyricsFile(event.target.files[0]);
  const handleImageChange = (event) => setImageFile(event.target.files[0]);

  const filteredArtists = allArtist
      .filter((artist) => artist.userName && artist.userName.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((artist) => !selectedArtists.some(selected => selected.id === artist.id));

  const handleUpload = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);

      if(!trackTitle || !genre || !musicFile || !imageFile) {
        alert("Please fill in all required fields");
        return
      }

      const musicURL = await uploadMusic(musicFile);
      let lyricsContent = null;
      if (lyricsFile) {
        lyricsContent = await uploadLyrics(lyricsFile);
      }

      const imageURL = await uploadImage(imageFile);

      console.log("Music URL:", musicURL);
      console.log("Lyrics Content:", lyricsContent);
      console.log("Image URL:", imageURL);

      await Instance.post('/upload-song', {
        trackTitle,
        artist: user?.id,
        musicURL,
        lyricsContent,
        imageURL,
        genre,
        releaseDate: new Date(),
        collaborators: selectedArtists.map(artist => artist.id),
        duration,
      });

      alert("Track uploaded successfully");
        setTrackTitle('');
        setGenre('');
        setMusicFile(null);
        setLyricsFile(null);
        setImageFile(null);
        setDuration(0);
        setSelectedArtists([]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }finally {
        setIsLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 via-purple-800 to-gray-900 text-white mt-16">
        {isLoading && <LoadingOverlay/>}
        <div className="w-full max-w-lg bg-black bg-opacity-90 p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center text-gradient bg-gradient-to-r from-purple-400 to-pink-500">
            Upload Your Track
          </h1>

          <form className="space-y-6" onSubmit={handleUpload}>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="trackTitle">
                Track Title
              </label>
              <input
                  className="w-full py-3 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-transform duration-150 ease-in-out transform hover:scale-105"
                  type="text"
                  id="trackTitle"
                  placeholder="Enter track title"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="uploadImage">
                Upload Track Image
              </label>
              <input
                  className="w-full pl-2 py-3 bg-gray-800 bg-opacity-70 rounded-lg text-white file:bg-purple-500 file:text-white file:rounded-md file: file:py-2 file:mr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="file"
                  id="uploadImage"
                  accept="image/*"
                  onChange={handleImageChange}
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="uploadController">
                Upload File
              </label>
              <input
                  className="w-full pl-2 py-3 bg-gray-800 bg-opacity-70 rounded-lg text-white file:bg-purple-500 file:text-white file:rounded-md file: file:py-2 file:mr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="file"
                  id="uploadController"
                  accept="audio/*"
                  onChange={handleMusicChange}
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="uploadLyrics">
                Upload Lyrics (file.lrc)
              </label>
              <input
                  className="w-full pl-2 py-3 bg-gray-800 bg-opacity-70 rounded-lg text-white file:bg-purple-500 file:text-white file:rounded-md file: file:py-2 file:mr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="file"
                  id="uploadLyrics"
                  accept="text/lrc"
                  onChange={handleLyricsChange}
              />
            </div>

            <div>
              <label
                  className="block text-gray-400 text-sm font-medium mb-1"
                  htmlFor="trackDescription"
              >
                Genres
              </label>
              <select
                  name="trackGenres"
                  id="trackGenres"
                  className="w-full p-3 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
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
                  className="w-full py-3 bg-gray-800 bg-opacity-70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-transform duration-150 ease-in-out transform"
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
                      <img src={artist.imagePath} alt={artist.userName} className="w-6 h-6 rounded-full object-cover"/>
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
                type="submit"
                className="w-full py-3 mt-4 bg-pink-200 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out transform hover:bg-gray-600"
            >
              Upload Track
            </button>
          </form>
        </div>
      </div>
  );
};

export default UploadTracks;