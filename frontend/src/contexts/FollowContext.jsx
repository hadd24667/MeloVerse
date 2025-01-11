import React, { createContext, useContext, useState } from 'react';
import axiosInstance from "../config/axiosCustomize";

const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
    const [followingArtists, setFollowingArtists] = useState([]); 

    const fetchFollowingArtists = async (userID) => {
        try {
            const response = await axiosInstance.get(`/following?userID=${userID}`);
            setFollowingArtists(response.data); // Cập nhật danh sách
        } catch (error) {
            console.error('Error fetching following artists:', error.message);
        }
    };

    const followArtist = async (userID, artistID) => {
        try {
            const response = await axiosInstance.post('/follow', { userID, artistID });
            setFollowingArtists((prev) => [...prev, artistID]); // Thêm vào danh sách
            return response.data.message;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Lỗi khi theo dõi nghệ sĩ.');
        }
    };

    const unfollowArtist = async (userID, artistID) => {
        try {
            const response = await axiosInstance.post('/unfollow', { userID, artistID });
            setFollowingArtists((prev) => prev.filter((id) => id !== artistID)); // Xóa khỏi danh sách
            return response.data.message;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Lỗi khi bỏ theo dõi nghệ sĩ.');
        }
    };
    console.log('Following Artists:', followingArtists);

    const value = {
        followingArtists,
        fetchFollowingArtists,
        followArtist,
        unfollowArtist,
    };

    return <FollowContext.Provider value={value}>{children}</FollowContext.Provider>;
};

export const useFollow = () => {
    return useContext(FollowContext);
};
