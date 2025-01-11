import React, { useEffect, useState } from 'react';
import '../../../styles/PendingApproval.css';
import Instance from "../../../config/axiosCustomize.js";
import PropTypes from "prop-types";
import {makeDurationString} from "../../../utils/durationUtils.js";

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
    const confirm = window.confirm('Are you sure you want to delete this album?');
    if (!confirm) return;
    try {
        await Instance.post('/admin/delete-song', { id });
        alert('Song deleted successfully');
        onDeleteSuccess(id);
    } catch (e) {
        console.error('Error deleting album:', e);
        alert('Error deleting album');
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
                            column === 'releaseDate' ? formatDate(row[column]) : row[column]
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

const AlbumForm = ({ album, onClose }) => {
    const [albumData] = useState({ ...album });
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Instance.post('/admin/get-album-songs', { albumID: album.id });
                const data = await response.data;
                setSongs(data);
            } catch (e) {
                console.error('Error fetching artist songs:', e);
            }
        };
        fetchData();
    }, [album.id]);

    const getCollaboratorsString = (song) => {
        const artistName = albumData.artistName;
        const collaborators = song.collaborators.join(', ');

        // Sử dụng artistName trong cả hai trường hợp
        return collaborators ? `${artistName}, ${collaborators}` : artistName;
    };


    const getDurationString = (duration) => {
        return makeDurationString(duration);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col">
                <div className="flex">
                    <div className="w-1/3">
                        <img
                            src={albumData.imagePath || 'https://i.pinimg.com/736x/5b/43/68/5b43688942c9e2381a304abb47dc9fd1.jpg'}
                            alt={albumData.title}
                            className="w-full h-auto max-w-48 max-h-48 object-cover rounded-lg"/>
                    </div>
                    <div className="w-2/3 pl-6">
                        <h2 className="text-2xl font-bold mb-4">Album Information</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Album : {albumData.title}</label>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Artist : {albumData.artistName}</label>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description
                                : {albumData.description || 'none'}</label>
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
                                <p className="text-sm text-gray-600">{getCollaboratorsString(song)||'none'}</p>
                            </div>
                            <span className="text-sm text-gray-600 w-1/12">{getDurationString(song.duration)||'0:00'}</span>
                        </div>
                    )) : <p>No songs found</p>}
                </div>
                <div className="inset-y-0 right-0">
                    <button className="px-4 py-2 text-white bg-green-400 rounded-lg mt-4 self-end"
                            onClick={onClose}>Ok
                    </button>
                </div>
            </div>
        </div>
    );
};

const AlbumAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const columns = ['title', 'artistName', 'releaseDate'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Instance.get('/admin/get-all-album');
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
        setSelectedAlbum(song);
    };

    const handleCloseForm = () => {
        setSelectedAlbum(null);
    };

    const filteredData = data.filter(album =>
        album.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            {selectedAlbum && <AlbumForm album={selectedAlbum} onClose={handleCloseForm} />}
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    onView: PropTypes.func.isRequired,
    onDeleteSuccess: PropTypes.func,
};

AlbumForm.propTypes = {
    album: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

ButtonClearSearch.propTypes = {
    onClear: PropTypes.func.isRequired
}

SearchBox.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired
}

export default AlbumAdmin;
