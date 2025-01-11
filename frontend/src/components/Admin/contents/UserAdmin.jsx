import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import Instance from "../../../config/axiosCustomize.js";

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

const ButtonExport = ({ onClick }) => (
    <button className="px-4 py-2 text-white bg-blue-500 rounded-lg" onClick={onClick}>
        Export Data
    </button>
);

const RefuseArtist = async (userName, onDeleteSuccess) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;
    try {
        await Instance.post('/admin/delete-user', { userName });
        alert('User deleted successfully');
        onDeleteSuccess(userName);
    } catch (e) {
        console.error('Error deleting user:', e);
        alert('Error deleting user');
    }
}

const DataTable = ({ columns, data, onView, onDeleteSuccess }) => {
    // const formatDate = (dateString) => {
    //     const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    //     return new Date(dateString).toLocaleDateString('en-US', options);
    // };

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
                            {column === 'email' ? (
                                <div
                                    title={row[column] || "This user don't have email"}
                                    className="truncate max-w-xs"
                                    style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}
                                >
                                    {row[column] && row[column].trim() !== ''
                                        ? row[column]
                                        : "This user don't have email"}
                                </div>
                            ) : (
                                row[column]
                            )}
                        </td>
                    ))}
                    <td className="py-2 text-left px-4">
                        <button className="px-4 py-2 text-black bg-blue-200 rounded-lg hover:bg-blue-300"
                                onClick={() => onView(row)}
                        >
                            View
                        </button>
                        <button
                            className="px-4 py-2 text-black bg-red-300 rounded-lg hover:bg-red-400"
                            onClick={() => RefuseArtist(row['userName'], onDeleteSuccess)}
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

const UserForm = ({ user, onClose }) => {
    const [userData] = useState({ ...user });


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col">
                <div className="flex">
                    <div className="w-2/6">
                        <img src={userData.imagePath || 'https://t4.ftcdn.net/jpg/09/65/44/19/360_F_965441943_81rMaCuM5TZeybNFy6ZRgTbgyF3iqrK5.jpg'}
                             alt={userData.userName}
                             className="w-full h-full max-w-52 max-h-52 object-cover rounded-lg" />
                    </div>
                    <div className="w-2/3 pl-6">
                        <h2 className="text-2xl font-bold mb-4">User Information</h2>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">User Name : </label>
                            <label className="text-gray-700">{userData.userName}</label>
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Role : </label>
                            <label className="text-gray-700">{userData.role}</label>
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Profile : </label>
                            <label className="text-gray-700">{userData.profile || 'none'}</label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 text-white bg-blue-500 rounded-lg" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const UserAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const columns = ['userName', 'email', 'role'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Instance.get('/admin/get-all-user');
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

    const handleView = (user) => {
        setSelectedUser(user);
    };

    const handleCloseForm = () => {
        setSelectedUser(null);
    };

    const filteredData = data.filter(user =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase())
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
            {selectedUser && <UserForm user={selectedUser} onClose={handleCloseForm} />}
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    onView: PropTypes.func.isRequired,
    onDeleteSuccess: PropTypes.func,
};

UserForm.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

ButtonClearSearch.propTypes = {
    onClear: PropTypes.func.isRequired
}

ButtonExport.propTypes = {
    onClick: PropTypes.func.isRequired
}

SearchBox.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired
}

export default UserAdmin;