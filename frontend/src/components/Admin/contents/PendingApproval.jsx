import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import '../../../styles/PendingApproval.css';
import Instance from "../../../config/axiosCustomize.js";

const SearchBox = ({ searchTerm, onSearch }) => (
    <input
        type="text"
        placeholder="Search"
        className="px-6 py-2 rounded-lg"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
    />
);

const ButtonClearSearch = ({ onClear }) => (
    <button className="px-4 py-2 text-white bg-blue-300 rounded-lg"
            onClick={onClear}
    >Clear</button>
);

const ButtonExport = ({ onClick }) => (
    <button className="px-4 py-2 text-white bg-blue-500 rounded-lg" onClick={onClick}>
        Export Data
    </button>
);

const RefuseArtist = async (userName, onDeleteSuccess) => {
    const confirm = window.confirm('Are you sure you want to refuse this artist?');
    if (!confirm) return;
    try {
        await Instance.post('/admin/reject-artist', { userName });
        alert('Artist rejected successfully');
        onDeleteSuccess(userName);
    } catch (e) {
        console.error('Error refusing artist:', e);
        alert('Error refusing artist');
    }
}

const AcceptArtist = async (userName, onDeleteSuccess) => {
    const confirm = window.confirm('Are you sure you want to accept this artist?');
    if (!confirm) return;
    try {
        await Instance.post('/admin/accept-artist', { userName });
        alert('Artist accepted successfully');
        onDeleteSuccess(userName);
    } catch (e) {
        console.error('Error accepting artist:', e);
        alert('Error accepting artist');
    }
}

const DataTable = ({ columns, data, onDeleteSuccess }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
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
                        <td key={column} className="py-2 text-left px-4">
                            {column === 'profile' ? (
                                <div title={row[column]}>
                                    {row[column].length > 20 ? `${row[column].slice(0, 20)}...` : row[column]}
                                </div>
                            ) : column === 'requestDate' ? formatDate(row[column]) : row[column]}
                        </td>
                    ))}
                    <td className="py-2 text-left px-4">
                        <button className="px-4 py-2 text-black bg-green-300 rounded-lg hover:bg-green-400"
                                onClick={() => AcceptArtist(row['userName'], onDeleteSuccess)}
                        >Accept</button>
                        <button className="px-4 py-2 text-black bg-red-300 rounded-lg hover:bg-red-400"
                                onClick={() => RefuseArtist(row['userName'], onDeleteSuccess)}
                        >Refuse</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

const PendingApproval = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const columns = ['userName', 'email', 'requestDate', 'profile'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Instance.get('/admin/get-pending-approval');
                setData(response.data);
            } catch (e) {
                console.error('Error fetching pending approvals:', e);
            }
        };
        fetchData();
    }, []);

    const DeleteWhenSuccess = (userName) => {
        setData(prevData => prevData.filter(user => user.userName !== userName));
    };

    const ClearSearch = () => {
        setSearchTerm('');
    }

    const filteredData = data.filter(artist =>
        artist.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='flex flex-col'>
            <div className='flex items-center justify-between py-5'>
                <div className='flex items-center gap-3'>
                    <SearchBox searchTerm={searchTerm} onSearch={setSearchTerm} />
                    <span className='text-3xl font-extra-light text-gray-400'>|</span>
                    <ButtonClearSearch onClear={ClearSearch} />
                </div>
                <div className='flex flex-row gap-5'>
                    {/*<ButtonAdd label={'artist'} />*/}
                    {/*<ButtonExport />*/}
                </div>
            </div>
            <DataTable columns={columns} data={filteredData} onDeleteSuccess={DeleteWhenSuccess} />
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    onDeleteSuccess: PropTypes.func,
};

ButtonExport.propTypes = {
    onClick: PropTypes.func.isRequired
}

ButtonClearSearch.propTypes = {
    onClear: PropTypes.func.isRequired
}

SearchBox.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired
}

export default PendingApproval;
