import React, { useEffect, useState } from 'react';
import { useUser } from "../../contexts/UserContext.jsx";
import useFetchArtistSong from "../../hooks/Artist/useFetchArtistSong.js";
import useFetchAllArtistAlbums from "../../hooks/Artist/useFetchAllArtistAlbums.js";
import { handleArtistSelect, handleRemoveArtist, handleSearchChange } from "../../utils/trackUtils.js";
import { uploadMusic, uploadImage, uploadLyrics } from "../../Services/UploadService.js";
import ArtistSearchList from "./ArtistSearchList.jsx";
import useFetchAllArtists from "../../hooks/Artist/useFetchAllArtists.js";
import LoadingOverlay from '../../components/LoadingOverlay';
import Instance from "../../config/axiosCustomize.js";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { getDuration, makeDurationString } from "../../utils/durationUtils.js";
import _ from 'lodash';

const ManageSongAlbum = () => {
    const { user } = useUser();

    const { artistSongs: fetchedArtistSongs, loading: songLoading, error: songError } = useFetchArtistSong();
    const { allArtistAlbums: fetchedAllArtistAlbums, loading: albumLoading, error: albumError } = useFetchAllArtistAlbums();
    const { allArtist, loading: artistLoading, error: artistError } = useFetchAllArtists();

    const [isLoading, setIsLoading] = useState(false);

    const [allArtistAlbums, setAllArtistAlbums] = useState([]);
    const [artistSongs, setArtistSongs] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);

    const [saveSong, setSaveSong] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    const [newImageFile, setNewImageFile] = useState(null);
    const [musicFile, setMusicFile] = useState(null);
    const [lyricsFile, setLyricsFile] = useState(null);

    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        setAllArtistAlbums(fetchedAllArtistAlbums);
        setArtistSongs(fetchedArtistSongs);
    }, [fetchedAllArtistAlbums, fetchedArtistSongs]);


    const handleMenuToggle = (e, song) => {
        const rect = e.target.getBoundingClientRect();
        setMenuPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
        setShowMenu(!showMenu);
        setSaveSong(song);
        console.log('song in menu toggle: ', song);
    };

    const handleSongClick = (songSelected) => {
        setShowMenu(false);
        console.log('song: ', songSelected);
        setSelectedSong(songSelected);
        setSelectedArtists(songSelected.collaborators);
    };

    const filteredArtists = allArtist
        .filter((artist) => artist.userName && artist.userName.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((artist) => !selectedArtists.some(selected => selected.id === artist.id));

    const handleAlbumEdit = (album) => {
        setEditingAlbum({
            ...album,
            imagePath: album.imagePath || "https://via.placeholder.com/150" // Placeholder nếu không có hình ảnh
        });
        setSelectedAlbum(null);
        setSelectedSong(null);
    };

    const handleAlbumClick = (album) => {
        setSelectedAlbum(album);
        setSelectedSong(null);
        setEditingAlbum(null);
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setNewImageFile(file);
            if (type === "album") {
                setEditingAlbum({ ...editingAlbum, imagePath: imageUrl });
            }
        }
    };


    const handelSongChange = async (event) => {setMusicFile(event.target.files[0]);};
    const handleLyricsChange = (event) => setLyricsFile(event.target.files[0]);

    const getAuthorNames = (song) => {
        const collaboratorNames = song.collaborators.map(collab => collab.userName).join(', ');
        let authorString = user?.userName;
        if (collaboratorNames.length > 0) {
            authorString = `${user?.userName}, ${collaboratorNames}`;
        }
        return authorString;
    };

    const getDurationString = (song) => {
        return makeDurationString(song.duration);
    }

    const handleUpdateAlbum = async () => {
        setIsLoading(true);
        try {
            let imagePath = editingAlbum.imagePath;
            if (newImageFile) {
                imagePath = await uploadImage(newImageFile);
            }

            const response = await Instance.post('/update-album', {
                title: editingAlbum.title,
                imagePath: imagePath,
                description: editingAlbum.description,
                albumID: editingAlbum.id,
            });

            console.log(response);
            alert('Album updated successfully');

            // Update the album list
            setAllArtistAlbums(prevAlbums => prevAlbums.map(album =>
                album.id === editingAlbum.id ? { ...album, ...editingAlbum, imagePath } : album
            ));
            setEditingAlbum(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSong = async () => {
        setIsLoading(true);
        if (!selectedSong) {
            setIsLoading(false);
            alert('No song selected');
            return;
        }
        console.log('selectedSong: ', selectedSong);
        try {
            let lyricsContent = selectedSong.lyrics;
            let imagePath = selectedSong.imagePath;
            let filePath = selectedSong.filePath;
            console.log('selectedSong: ', selectedSong.filePath);
            let duration = selectedSong.duration;

            if (musicFile) {
                filePath = await uploadMusic(musicFile);
                duration = await getDuration(musicFile);
            }

            if (newImageFile) {
                imagePath = await uploadImage(newImageFile);
            }

            if (lyricsFile) {
                lyricsContent = await uploadLyrics(lyricsFile);
            }

            if (!filePath || !imagePath) {
                setIsLoading(false);
                alert('Music file or image is missing');
                return;
            }

            const payload = {
                songID: selectedSong.id,
                trackTitle: selectedSong.trackTitle,
                imagePath: imagePath,
                filePath: filePath,
                albumID: selectedSong.albumID,
                genre: selectedSong.genre,
                lyrics: lyricsContent,
                collaborators: selectedArtists.map(artist => artist.id),
                duration: duration,
            };

            console.log('Payload:', payload);
            console.log('SaveSong:', saveSong);

            if (_.isEqual(payload, saveSong)) {
                setIsLoading(false);
                alert('No changes detected in the song');
                return;
            }

            const response = await Instance.post('/update-song', payload);
            console.log(response);
            alert('Song updated successfully');

            // Update the song list
            setArtistSongs(prevSongs => prevSongs.map(song =>
                song.id === selectedSong.id ? { ...song, ...selectedSong, imagePath, filePath, duration, lyrics: lyricsContent } : song
            ));
            setSelectedSong(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAlbum = async (albumID) => {
        console.log(albumID);
        const confirmSave = window.confirm("Are you sure you want to delete this album?");
        if (!confirmSave) {
            alert('Album deletion cancelled');
        } else {
            try {
                const response = await Instance.post('/delete-album', { albumID });
                console.log(response);
                alert('Album deleted successfully');

                // Remove the album from the list
                setAllArtistAlbums(prevAlbums => prevAlbums.filter(album => album.id !== albumID));
                setSelectedAlbum(null);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDeleteSong = async (song) => {
        console.log(song);
        setShowMenu(false);
        const confirmSave = window.confirm("Are you sure you want to delete this song?");
        if (!confirmSave) {
            alert('Song deletion cancelled');
            return;
        } else {
            try {
                const response = await Instance.post('/delete-song', { songID: song.id });
                console.log(response);
                alert('Song deleted successfully');

                // Remove the song from the list
                setArtistSongs(prevSongs => prevSongs.filter(s => s.id !== song.id));
                setSelectedSong(null);
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (songLoading || albumLoading || artistLoading) {
        return <div>Loading...</div>;
    }

    if (songError || albumError || artistError) {
        return <div>Error...</div>;
    }

    return (
        <div className="relative max-w-8xl mx-auto bg-black p-8 rounded-xl text-white flex gap-8 mt-16">
            {isLoading && <LoadingOverlay/>}
            <div className={`w-1/2`}>
                <h2 className="text-3xl font-bold mb-6">Manage Albums</h2>
                <div className='overflow-y-auto max-h-96'>
                    <div className="space-y-6">
                        <div key="single-tracks"
                             className={`p-6 bg-gray-900 rounded-lg cursor-pointer ${selectedAlbum && selectedAlbum.id !== null ? 'opacity-50' : ''}`}
                             onClick={() => handleAlbumClick({
                                 id: null,
                                 title: 'Single Tracks',
                                 description: '',
                                 songs: artistSongs?.filter(song => song.albumID === null).map(song => song.id) || []
                             })}>
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://cdn.vectorstock.com/i/preview-1x/73/15/music-book-thin-line-icon-vector-4717315.jpg"
                                    alt="Single Tracks"
                                    className="w-24 h-24 object-cover rounded-lg mr-4"/>
                                <div>
                                    <h3 className="text-2xl font-semibold">Single</h3>
                                </div>
                            </div>
                        </div>

                        {allArtistAlbums?.map((album) => (
                            <div key={album.id}
                                 className={`p-6 bg-gray-900 rounded-lg ${selectedAlbum && selectedAlbum.id !== album.id ? 'opacity-50' : ''}`}>
                                <div className="flex items-center mb-4 cursor-pointer"
                                     onClick={() => handleAlbumClick(album)}>
                                    <img src={album.imagePath} alt={album.title}
                                         className="w-24 h-24 object-cover rounded-lg mr-4"/>
                                    <div>
                                        <h3 className="text-2xl font-semibold">{album.title}</h3>
                                        <p className="text-gray-400">{album.description}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    {album.id && (
                                        <button className="flex-1 py-2 bg-pink-200 text-black rounded-lg"
                                                onClick={() => handleAlbumEdit(album)}>Edit Album
                                        </button>
                                    )}
                                    <button className="flex-1 py-2 bg-pink-50 text-black rounded-lg"
                                            onClick={() => handleDeleteAlbum(album.id)}>Delete Album
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`w-1/2 ${selectedSong || editingAlbum ? 'opacity-50' : ''} `}>
                <h2 className="text-3xl font-bold mb-6">Manage Songs</h2>
                <div className="flex mb-4">
                    <div className="w-3/5">Name</div>
                    <div className="w-1/5">Plays</div>
                    <div className="w-4/12">Duration</div>
                </div>
                <div className='overflow-y-auto max-h-96'>
                    <div className="space-y-4">
                        {selectedAlbum ? artistSongs?.filter(song => song.albumID === selectedAlbum.id).map((song) => (
                            <div key={song.id}
                                 className="flex items-center p-4 bg-gray-900 rounded-lg cursor-pointer"
                            >
                                <div className="w-3/5 flex items-center space-x-4">
                                    <img src={song.imagePath} alt={song.trackTitle}
                                         className="w-16 h-16 object-cover rounded-lg"/>
                                    <div>
                                        <h3 className="text-xl font-semibold">{song.trackTitle}</h3>
                                        <p className="text-gray-400">{getAuthorNames(song)}</p>
                                    </div>
                                </div>
                                <div className="w-1/5 text-gray-400">{song.plays}</div>
                                <div className="w-1/5 text-gray-400">{getDurationString(song)}</div>
                                <div>
                                    <PiDotsThreeOutlineVertical className="w-12"
                                                                onClick={(e) => handleMenuToggle(e, song)}/>
                                    {showMenu && (
                                        <div style={{
                                            position: 'absolute',
                                            top: `${menuPosition.top - 80}px`,
                                            left: `${menuPosition.left}px`
                                        }}
                                             className="bg-white shadow-md rounded-lg p-2">
                                            <button className="block w-full text-left p-2 hover:bg-gray-200"
                                                    onClick={() => handleSongClick(saveSong)}>Edit
                                            </button>
                                            <button className="block w-full text-left p-2 hover:bg-gray-200"
                                                    onClick={() => handleDeleteSong(saveSong)}>Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <p>Select an album to see its songs.</p>
                        )}
                    </div>
                </div>
            </div>


            {selectedSong && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80">
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <h3 className="text-2xl font-semibold mb-4">Edit Song</h3>
                        <input
                            className="w-full py-2 mb-4 bg-gray-700 rounded-lg text-white"
                            type="file"
                            accept={"image/*"}
                            onChange={(e) => handleImageChange(e, 'song')}
                        />
                        <img src={selectedSong.imagePath} alt={selectedSong.trackTitle}
                             className="w-24 h-24 object-cover rounded-lg mb-4"/>

                        <input
                            className="w-full py-2 mb-4 bg-gray-700 rounded-lg text-white"
                            type="text"
                            value={selectedSong.trackTitle}
                            onChange={(e) => setSelectedSong({...selectedSong, trackTitle: e.target.value})}
                        />
                        <audio
                            src={selectedSong.filePath}
                            className="w-full max-h-10 py-2 mb-4 rounded-lg text-white"
                            controls
                        />
                        <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="trackTitle">
                        Lyrics
                        </label>
                        <input
                            className="w-full py-2 mb-4 bg-gray-700 rounded-lg text-white"
                            type="file"
                            id="uploadLyrics"
                            accept="text/lrc"
                            onChange={handleLyricsChange}
                        />
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
                                    <div key={artist.id}
                                         className="flex items-center space-x-2 bg-gray-800 rounded-full px-3 py-1">
                                        <img src={artist.imagePath} alt={artist.userName}
                                             className="w-6 h-6 rounded-full object-cover"/>
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
                        <button className="w-full py-2 bg-pink-200 text-black rounded-lg"
                                onClick={handleUpdateSong}>Save
                        </button>
                        <button className="w-full py-2 mt-2 bg-gray-700 text-white rounded-lg"
                                onClick={() => setSelectedSong(null)}>Cancel
                        </button>
                    </div>
                </div>
            )}

            {editingAlbum && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80">
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <h3 className="text-2xl font-semibold mb-4">Edit Album</h3>
                        <input
                            className="w-full py-2 mb-4 bg-gray-700 rounded-lg text-white"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'album')}
                        />
                        <img src={editingAlbum.imagePath} alt={selectedAlbum?.title}
                             className="w-24 h-24 object-cover rounded-lg mb-4"/>
                        <input
                            className="w-full py-2 mb-4 bg-gray-700 rounded-lg text-white"
                            type="text"
                            value={editingAlbum.title}
                            onChange={(e) => setEditingAlbum({...editingAlbum, title: e.target.value})}
                        />
                        <textarea
                            className="w-full py-2 mb-4 bg-gray-700 rounded-lg text-white"
                            rows="4"
                            value={editingAlbum.description}
                            onChange={(e) => setEditingAlbum({...editingAlbum, description: e.target.value})}
                        ></textarea>
                        <button className="w-full py-2 mt-4 bg-pink-200 text-black rounded-lg"
                                onClick={handleUpdateAlbum}>Save
                        </button>
                        <button className="w-full py-2 mt-2 bg-gray-700 text-white rounded-lg"
                                onClick={() => setEditingAlbum(null)}>Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSongAlbum;