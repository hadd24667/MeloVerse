const { User, Follow, sequelize, Song } = require('../models');

exports.getPopularArtists = async (req, res) => {
    try {
        const popularArtists = await User.findAll({
            where: { role: 'artist' },
            attributes: {
                include: [
                    // Đếm số lượng người theo dõi bằng cách sử dụng alias và ánh xạ đúng cột
                    [sequelize.literal(`(SELECT COUNT(*) FROM Follows WHERE Follows.artistID = User.id)`), 'followerCount'],
                ],
            },
            order: [[sequelize.literal('followerCount'), 'DESC']], 
            limit: 15, 
        });

        res.status(200).json({ artists: popularArtists });
    } catch (error) {
        console.error('Error fetching popular artists:', error);
        res.status(500).json({
            message: 'Failed to fetch popular artists',
            error: error.message,
        });
    }
};

exports.getArtistDetails = async (req, res) => {
    const { artistID } = req.params;

    if (!artistID) {
        return res.status(400).send({ error: 'Artist ID is required' });
    }

    try {
        // Lấy thông tin nghệ sĩ
        const artistDetails = await User.findByPk(artistID, {
            where: { role: 'artist' },
            attributes: {
                include: [
                    // Đếm số lượng người theo dõi
                    [sequelize.literal(`(SELECT COUNT(*) FROM Follows WHERE Follows.artistID = User.id)`), 'followerCount'],
                ],
            },
            include: [
                {
                    model: Song,
                    as: 'Songs', 
                    attributes: ['id', 'trackTitle', 'duration', 'plays', 'imagePath'],
                },
            ],
        });

        if (!artistDetails) {
            return res.status(404).send({ error: 'Artist not found' });
        }

        res.status(200).json({ artist: artistDetails });
    } catch (error) {
        console.error('Error fetching artist details:', error);
        res.status(500).json({
            message: 'Failed to fetch artist details',
            error: error.message,
        });
    }
};

