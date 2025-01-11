const { Album, User, Song, Collaborator } = require('../models');

exports.getTopAlbum = async (req, res) => {
    try {
        const topAlbums = await Album.findAll({
            include: [
                {
                    model: User,
                    as: 'Artist', 
                    attributes: ['id', 'userName'], 
                },
            ],
            attributes: ['id', 'title', 'artistID', 'imagePath', 'releaseDate'],
            order: [['releaseDate', 'DESC']], 
            limit: 10, 
        });

        res.status(200).json({ albums: topAlbums });
    } catch (error) {
        console.error('Error fetching top albums:', error);
        res.status(500).json({ error: 'Failed to fetch top albums' });
    }
};

exports.getAlbumDetails = async (req, res) => {
    const albumID = req.params.albumID;
    console.log('Request params:', req.params);
    console.log('Fetching album details for ID:', albumID);

    try {
        // Tìm album theo ID và bao gồm thông tin liên quan
        const album = await Album.findByPk(albumID, {
            include: [
                {
                    model: Song,
                    as: 'songs', // Danh sách bài hát trong album
                    attributes: ['id', 'trackTitle', 'duration', 'plays', 'imagePath'],
                    include: [
                        {
                            model: User,
                            as: 'Artist', // Nghệ sĩ chính của bài hát
                            attributes: ['id', 'userName'],
                        },
                        {
                            model: User,
                            as: 'Collaborators', // Danh sách cộng sự
                            attributes: ['id', 'userName'],
                            through: { attributes: [] }, // Không lấy thông tin bảng trung gian
                        },
                    ],
                },
                {
                    model: User,
                    as: 'Artist', // Nghệ sĩ chính của album
                    attributes: ['id', 'userName'],
                },
            ],
        });
               

        // Kiểm tra nếu không tìm thấy album
        if (!album) {
            console.log('Album not found for ID:', albumID);
            return res.status(404).json({ error: 'Album not found' });
        }

        // Trả về dữ liệu album
        res.status(200).json(album);
    } catch (error) {
        console.error('Error fetching album details:', error);
        res.status(500).json({ error: 'Failed to fetch album details' });
    }
};

