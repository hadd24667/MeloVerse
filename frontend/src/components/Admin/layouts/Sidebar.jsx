import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const buttonLogoutClass =
    "cursor-pointer flex items-center gap-2 text-red-500 font-light px-3 py-2 mb-3 hover:bg-red-500 hover:no-underline hover:text-white focus:bg-red-500 active:bg-red-500 rounded-lg";

const Sidebar = () => {
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState('');

    const handleNavigate = (route) => {
        setSelectedMenu(route);
        navigate(`/admin/${route}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    const getMenuItemClass = (route) => {
        return selectedMenu === route
            ? "flex items-center gap-2 text-white px-3 py-2 bg-pink-300 rounded-lg"
            : "flex items-center gap-2 text-white px-3 py-2 hover:bg-gray-700 rounded-lg";
    };

    return (
        <div className="bg-black shadow-2xl flex flex-col min-w-[300px] min-h-screen border">
            <div className="flex items-center gap-2 px-6 py-5 bg-black flex-shrink-0 border-b border-zinc-300">
                <img src="../../../../public/assets/logo.png" alt="Logo" className="w-12"/>
                <div className="self-center text-3xl font-semibold whitespace-nowrap text-white">
                    Meloverse
                </div>
            </div>
            <div className="flex flex-1 flex-col px-5 gap-2 py-2 bg-gray-850">
                <div className={getMenuItemClass('')} onClick={() => handleNavigate('')}>
                    <i className="ri-dashboard-line"></i>
                    <span>Dashboard</span>
                </div>
                <div className={getMenuItemClass('pending-approval')} onClick={() => handleNavigate('pending-approval')}>
                    <i className="ri-stack-line"></i>
                    <span>Pending Approval</span>
                </div>
                <div className={getMenuItemClass('songs')} onClick={() => handleNavigate('songs')}>
                    <i className="ri-music-line"></i>
                    <span>Song</span>
                </div>
                <div className={getMenuItemClass('album')} onClick={() => handleNavigate('album')}>
                    <i className="ri-play-list-line"></i>
                    <span>Albums</span>
                </div>
                <div className={getMenuItemClass('artist')} onClick={() => handleNavigate('artist')}>
                    <i className="ri-user-star-line"></i>
                    <span>Artist</span>
                </div>
                <div className={getMenuItemClass('user')} onClick={() => handleNavigate('user')}>
                    <i className="ri-user-line"></i>
                    <span>User</span>
                </div>
            </div>
            <div className="flex flex-col px-5 gap-2 py-2 pt-5 border-t border-white bg-gray-850">
                <div className="flex items-center gap-2 text-white px-3 py-2 hover:bg-gray-700 active:bg-pink-200 rounded-lg">
                    <i className="ri-question-line"></i>
                    <span>Support</span>
                </div>
                <div className={buttonLogoutClass} onClick={handleLogout}>
                    <i className="ri-logout-box-r-line"></i>
                    <span>Sign Out</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;