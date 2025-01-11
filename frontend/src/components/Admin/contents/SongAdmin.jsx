import React, { useEffect, useState } from 'react';
import '../../../styles/PendingApproval.css';
import Instance from "../../../config/axiosCustomize.js";
import PropTypes from "prop-types";

const SearchBox = ({ searchTerm, onSearch }) => (
    <input
        type="text"
        placeholder="Search"
        className="px-3 py-2 rounded-lg"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
    />
);

const ButtonClearSearch = ({ onClear }) => (
    <button className="px-4 py-2 text-white bg-blue-300 rounded-lg" onClick={onClear}>
        Clear
    </button>
);

const RefuseSong = async (id, onDeleteSuccess) => {
    const confirm = window.confirm('Are you sure you want to delete this song?');
    if (!confirm) return;
    try {
        await Instance.post('/admin/delete-song', { id });
        alert('Song deleted successfully');
        onDeleteSuccess(id);
    } catch (e) {
        console.error('Error deleting song:', e);
        alert('Error deleting song');
    }
}

const DataTable = ({ columns, data, onView, onDeleteSuccess }) => {
    const formatDate = (dateString) => {
        const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <table className="min-w-full bg-light-blue-100 table-rounded shadow-lg">
            <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column} className="bg1 py-2 text-white text-left px-4">{column}</th>
                ))}
                <th className="py-2 text-left text-white px-4 bg1">Actions</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg2222 text-black" : "bg3222 text-black"}>
                    {columns.map((column) => (
                        <td key={column} className="py-2 text-left px-4">{
                            column === 'releaseDate' ? formatDate(row[column]) :
                                column === 'collaborators' ? row['collaborators'].map(collab => collab.userName).join(', ')
                                    : row[column]
                        }</td>
                    ))}
                    <td className="py-2 text-left px-4">
                        <button className="px-4 py-2 text-black bg-blue-200 rounded-lg hover:bg-blue-300"
                                onClick={() => onView(row)}
                        >
                            View
                        </button>
                        <button
                            className="px-4 py-2 text-black bg-red-300 rounded-lg hover:bg-red-400"
                            onClick={() => RefuseSong(row['id'], onDeleteSuccess)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

const SongForm = ({ song, onClose }) => {
    const [songData] = useState({ ...song });

    // const formatDuration = (seconds) => {
    //     const minutes = Math.floor(seconds / 60);
    //     const remainingSeconds = seconds % 60;
    //     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    // };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/5 flex flex-col">
                {/* Hàng đầu tiên */}
                <div className="flex mb-4">
                    <div className="w-1/3">
                        <img
                            src={songData.imagePath || 'https://t4.ftcdn.net/jpg/09/65/44/19/360_F_965441943_81rMaCuM5TZeybNFy6ZRgTbgyF3iqrK5.jpg'}
                            alt={songData.trackTitle}
                            className="w-full h-auto max-w-48 max-h-48 object-cover rounded-lg"/>
                    </div>
                    <div className="w-2/3 pl-6">
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Title: </label>
                            <label className="text-gray-700">{songData.trackTitle}</label>
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Author: </label>
                            <label className="text-gray-700">{songData.artistName}</label>
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Collab: </label>
                            <label className="text-gray-700">{Array.isArray(songData.collaborators)
                                ? songData.collaborators.map(collab => collab.userName).join(', ')
                                : songData.collaborators || 'No collaborators available'}
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Album: </label>
                            <label className="text-gray-700">{songData.albumTitle || 'none'}</label>
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Plays: </label>
                            <label className="text-gray-700">{songData.plays || '0'}</label>
                        </div>
                    </div>
                </div>

                {/* Hàng thứ hai */}
                <div className="mb-4">
                    <label className="block text-gray-700">File Path</label>
                    <audio controls className="w-full">
                        <source src={songData.filePath} type="audio/mp3"/>
                        Your browser does not support the audio element.
                    </audio>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Lyrics</label>
                    <div
                        className="w-full h-40 px-2 py-1 border rounded-lg overflow-y-auto bg-gray-50 text-gray-900"
                    >
                        {songData.lyrics && Array.isArray(songData.lyrics) ? (
                            songData.lyrics.map((line, index) => (
                                <p key={index} className="whitespace-pre-wrap">
                                    {line}
                                </p>
                            ))
                        ) : songData.lyrics ? (
                            <p className="whitespace-pre-wrap">{songData.lyrics}</p>
                        ) : (
                            <p>No lyrics available</p>
                        )}
                    </div>
                </div>


                {/* Nút đóng */}
                <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 text-white bg-blue-500 rounded-lg" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>


    );
};

const SongAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const columns = ['trackTitle', 'artistName', 'albumTitle', 'releaseDate', 'collaborators'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Instance.get('/admin/get-all-song');
                setData(response.data);
            } catch (e) {
                console.error('Error fetching pending approvals:', e);
            }
        };
        fetchData();
    }, []);

    const DeleteWhenSuccess = (id) => {
        setData(prevData => prevData.filter(song => song.id !== id));
    };

    const ClearSearch = () => {
        setSearchTerm('');
    }

    const handleView = (song) => {
        setSelectedSong(song);
    };

    const handleCloseForm = () => {
        setSelectedSong(null);
    };

    const filteredData = data.filter(song =>
        song.trackTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='flex flex-col'>
            <div className='flex items-center justify-between py-5'>
                <div className='flex items-center gap-3'>
                    <SearchBox searchTerm={searchTerm} onSearch={setSearchTerm}/>
                    <span className='text-3xl font-extra-light text-gray-400'>|</span>
                    <ButtonClearSearch onClear={ClearSearch}/>
                </div>
                <div className='flex flex-row gap-5'>
                    {/*<ButtonAdd label={'artist'} />*/}
                    {/*<ButtonExport />*/}
                </div>
            </div>
            <DataTable columns={columns} data={filteredData} onView={handleView} onDeleteSuccess={DeleteWhenSuccess}/>
            {selectedSong && <SongForm song={selectedSong} onClose={handleCloseForm}/>}
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    onView: PropTypes.func.isRequired,
    onDeleteSuccess: PropTypes.func,
};

SongForm.propTypes = {
    song: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

ButtonClearSearch.propTypes = {
    onClear: PropTypes.func.isRequired
}

SearchBox.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired
}

export default SongAdmin;
