const User = require('../models/user');
const Song = require('../models/song');
const Album = require('../models/album');

const getNumberOfAll = async (req, res) => {
    try {
        const users = await User.count();
        const songs = await Song.count();
        const albums = await Album.count();
        const pendingApproval = await User.count({
            where: {
                artistRegister: true
            }
        });

        const response = {
            users,
            songs,
            albums,
            pendingApproval
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
}

const getSongRelease = async (req, res) => {
    try {
        const songs = await Song.findAll({
            attributes: ['releaseDate']
        });

        const response = songs.map(song => new Date(song.releaseDate));
        const dataByYearMonth = {};

        response.forEach(date => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // getMonth() trả về từ 0-11, cần cộng thêm 1 để ra 1-12

            if (!dataByYearMonth[year]) {
                dataByYearMonth[year] = Array(12).fill(0); // Tạo mảng 12 tháng với giá trị ban đầu là 0
            }

            dataByYearMonth[year][month - 1] += 1; // Tăng số lượng bài hát của tháng hiện tại
        });

        res.status(200).json(dataByYearMonth);
    } catch (error) {
        console.error('Error fetching album release dates:', error);
        res.status(500).json({ message: 'Error fetching album release dates' });
    }
}

module.exports = { getNumberOfAll, getSongRelease };