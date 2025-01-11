import React, { useEffect, useState } from 'react';
import Instance from "../../../config/axiosCustomize.js";
import PropTypes from "prop-types";
import {makeDurationString} from "../../../utils/durationUtils.js";
import {uploadImage} from "../../../Services/UploadService.js";
import '../../../styles/ArtistAdmin.css';

const SearchBox = ({ onSearch }) => (
    <input
        type="text"
        placeholder="Search"
        className="px-3 py-2 rounded-lg"
        onChange={(e) => onSearch(e.target.value)}
    />
);

// const ButtonAdd = ({ label }) => (
//     <button className="px-4 py-2 text-white bg-green-500 rounded-lg">
//         Add {label}
//     </button>
// );

const deleteArtist = async (artist, onDeleteSuccess) => {
    const confirm = window.confirm('Are you sure you want to delete this artist?');
    if (!confirm) return;
    console.log(artist.id);
    try {
        const id = artist.id;
        await Instance.post('/admin/delete-artist', { id });
        alert('Artist deleted successfully');
        onDeleteSuccess(id);
    } catch (e) {
        console.error('Error deleting artist:', e);
        alert('Error deleting artist: ' + e.message);
    }
};

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
};

const DataTable = ({ data, onEdit, onDeleteSuccess }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((artist, index) => (
            <div key={index}
                 className="max-h-96 bg-white bg-cover bg-center bg-no-repeat text-black p-4 rounded-lg shadow-lg flex flex-col justify-between backdrop-filter backdrop-blur-lg form-background"
                // style={{backgroundImage: 'url(https://img.freepik.com/free-vector/pastel-gradient-blur-vector-background_53876-174871.jpg)'}}
            >
                <div>
                    <img
                        src={artist.imagePath || 'https://i.pinimg.com/736x/5b/43/68/5b43688942c9e2381a304abb47dc9fd1.jpg'}
                        alt={artist.userName}
                        className="w-full max-h-52 object-cover rounded-lg"
                    />
                    <h2 className="text-xl font-bold">{artist.userName}</h2>
                    <p>Followers: {artist.followers}</p>
                    <p title={artist.topSong}>
                        Top Song: {truncateText(artist.topSong, 20)}
                    </p>
                </div>
                <div className="mt-2 flex justify-end gap-2">
                    <button className="px-4 py-2 text-black bg-blue-300 rounded-lg"
                            onClick={() => onEdit(artist)}>Edit
                    </button>
                    <button className="px-4 py-2 text-black bg-red-300 rounded-lg"
                            onClick={() => deleteArtist(artist, onDeleteSuccess)}>Delete
                    </button>
                </div>
            </div>
        ))}
    </div>

);

const ArtistForm = ({artist, onClose, onSaveSuccess}) => {
    const [songs, setSongs] = useState([]);
    const [artistData, setArtistData] = useState({...artist});
    const [newImageFile, setNewImageFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Instance.post('/admin/get-artist-songs', {artistID: artist.id});
                const data = await response.data;
                setSongs(data);
            } catch (e) {
                console.error('Error fetching artist songs:', e);
            }
        };
        fetchData();
    }, [artist.id]);

    const saveArtist = async (onSaveSuccess) => {
        try {
            let imagePath = artist.imagePath;

            if (newImageFile) {
                imagePath = await uploadImage(newImageFile);
            }

            const payload = {
                id: artist.id,
                userName: artistData.userName,
                profile: artistData.profile,
                imagePath: imagePath,
            };
            console.log(payload);
            await Instance.post('/admin/update-artist', payload);
            alert('Artist updated successfully');
            onSaveSuccess(payload);
            onClose();
        } catch (e) {
            console.error('Error saving artist:', e);
        }
    };

    const getDurationString = (duration) => {
        return makeDurationString(duration);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setArtistData({
            ...artistData,
            [name]: value
        });
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setNewImageFile(file);
            if (type === 'image') {
                setArtistData({ ...artistData, imagePath: imageUrl });
            } else {
                setArtistData({ ...artistData, imagePath: imageUrl });
            }
        }
    };

    const getCollaboratorsString = (song) => {
        const collaborators = song.collaborators.join(', ');
        return collaborators ? `${artistData.userName}, ${collaborators}` : artistData.userName;
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col">
                <div className="flex">
                    <div className="w-1/3">
                        <img src={artistData.imagePath || 'https://i.pinimg.com/736x/5b/43/68/5b43688942c9e2381a304abb47dc9fd1.jpg'}
                             alt={artistData.userName}
                             className="w-full h-full max-h-64 max-w-52 object-cover rounded-lg" />
                    </div>
                    <div className="w-2/3 pl-6">
                        <h2 className="text-2xl font-bold mb-4">Artist Information</h2>
                        <input type="file"
                               name="imagePath"
                               accept="image/*"
                               onChange={(e) => handleImageChange(e, 'image')}
                               className=""
                               id="file-input"
                        />
                        <div className="mb-4">
                            <label className="block text-gray-700">Artist</label>
                            <input type="text"
                                   name="userName"
                                   value={artistData.userName}
                                   onChange={handleInputChange}
                                   className="w-full px-1 py-2 border rounded-lg"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Profile</label>
                            <textarea value={artistData.profile}
                                      name="profile"
                                      onChange={handleInputChange}
                                      className="w-full px-1 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>
                <div className="h-48 overflow-y-scroll mt-4 border-solid rounded-lg">
                    {songs.length > 0 ? songs.map((song, index) => (
                        <div key={index} className="flex items-center mb-4">
                            <span className="text-gray-500 w-1/12">{index + 1}</span>
                            <img src={song.imagePath} alt={song.trackTitle}
                                 className="w-12 h-12 object-cover rounded-lg mr-4"/>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">{song.trackTitle}</h3>
                                <p className="text-sm text-gray-600">{getCollaboratorsString(song)}</p>
                            </div>
                            <span className="text-sm text-gray-600 w-1/12">{getDurationString(song.duration)}</span>
                        </div>
                    )) : <p>No songs found</p>}
                </div>
                <div className="inset-y-0 right-0">
                    <button className="px-4 py-2 text-white bg-green-500 rounded-lg mt-4 self-end"
                            onClick={() => saveArtist(onSaveSuccess)}>Save
                    </button>
                    <button className="px-4 py-2 text-white bg-blue-500 rounded-lg mt-4 self-end"
                            onClick={onClose}>Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const ArtistAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Instance.get('/admin/get-artist-info');
                const data = await response.data;
                setData(data);
                console.log(data);
            } catch (e) {
                console.error('Error fetching artists:', e);
            }
        };
        fetchData();
    }, []);

    const handleEdit = (artist) => {
        setSelectedArtist(artist);
    };

    const handleCloseForm = () => {
        setSelectedArtist(null);
    };

    const handleDeleteSuccess = (id) => {
        setData(prevData => prevData.filter(artist => artist.id !== id));
    };

    const handleSaveSuccess = (updatedArtist) => {
        setData(prevData => prevData.map(artist =>
            artist.id === updatedArtist.id
                ? { ...artist, userName: updatedArtist.userName, profile: updatedArtist.profile, imagePath: updatedArtist.imagePath }
                : artist
        ));
    };

    const filteredData = data.filter(artist =>
        artist.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='flex flex-col'>
            <div className='flex items-center justify-between py-5'>
                <div className='flex items-center gap-3'>
                    <SearchBox onSearch={setSearchTerm} />
                </div>
                <div className='flex flex-row gap-5'>
                    {/*<ButtonAdd label={'artist'} />*/}
                </div>
            </div>
            <DataTable data={filteredData} onEdit={handleEdit} onDeleteSuccess={handleDeleteSuccess} />
            {selectedArtist && <ArtistForm artist={selectedArtist} onClose={handleCloseForm} onSaveSuccess={handleSaveSuccess} />}        </div>
    );
};

ArtistForm.propTypes = {
    artist: PropTypes.object,
    onClose: PropTypes.func,
    onSaveSuccess: PropTypes.func,
};

DataTable.propTypes = {
    data: PropTypes.array,
    onEdit: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
}

SearchBox.propTypes = {
    onSearch: PropTypes.func,
};

// ButtonAdd.propTypes = {
//     label: PropTypes.string,
// }

export default ArtistAdmin;
