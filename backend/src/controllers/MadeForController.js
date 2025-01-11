const { History, Song, User, sequelize } = require('../models');
const { Op, where, Model } = require('sequelize');

exports.getMegamix = async (req, res) => {
    try {
        const { userID } = req.params;

        if (!userID) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        // Lấy 5 bài hát được nghe nhiều nhất của người dùng cụ thể
        const topListenedSongs = await History.findAll({
            where: {
                listenerID: userID
            },
            attributes: [
                'songID',
                'totalListenTime',
                [sequelize.fn('MAX', sequelize.col('timeListened')), 'lastTimeListened']
            ],
            include: [{
                model: Song,
                as: 'song',
                attributes: ['id', 'trackTitle', 'genre', 'plays', 'duration', 'imagePath'],
                include: [{
                    model: User,
                    as: 'Artist',
                    attributes: ['id', 'userName']
                }]
            }],
            group: ['History.songID', 'History.timeListened', 'History.totalListenTime', 'song.id', 'song.trackTitle', 'song.genre', 'song.plays', 'song.duration', 'song.imagePath', 'song->Artist.id', 'song->Artist.userName'],
            order: [
                ['totalListenTime', 'DESC'],
                [sequelize.literal('MAX(timeListened)'), 'DESC']
            ],
            limit: 5
        });

        if (topListenedSongs.length === 0) {
            return res.status(404).json({ message: 'No listening history found' });
        }

        // Lấy thể loại chiếm đa số
        const genres = topListenedSongs.map(history => history.song.genre);
        const genreCounts = {};
        let dominantGenre = genres[0];
        let maxCount = 0;

        genres.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            if (genreCounts[genre] > maxCount) {
                maxCount = genreCounts[genre];
                dominantGenre = genre;
            }
        });

        // Lấy thêm 5 bài hát cùng thể loại
        const relatedSongs = await Song.findAll({
            where: {
                genre: dominantGenre,
                id: {
                    [Op.notIn]: topListenedSongs.map(history => history.song.id)
                }
            },
            include: [{
                model: User,
                as: 'Artist',
                attributes: ['id', 'userName']
            }],
            order: [['plays', 'DESC']],
            limit: 5
        });

        const megamix = {
            topListened: topListenedSongs.map(history => history.song),
            relatedSongs: relatedSongs,
            dominantGenre: dominantGenre
        };

        return res.status(200).json(megamix);
    } catch (error) {
        console.error('Error in getMegamix:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getMixByGenre = async (req, res) => {
    try {
        const { userID, genre } = req.params;

        if (!userID) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        if (!genre) {
            return res.status(400).json({ message: 'Genre is required' });
        }

        // Lấy các bài hát được nghe nhiều nhất của người dùng theo thể loại
        const topListenedSongs = await History.findAll({
            attributes: [
                'songID',
                [sequelize.fn('MAX', sequelize.col('timeListened')), 'lastTimeListened'],
                [sequelize.fn('SUM', sequelize.col('totalListenTime')), 'totalTime']
            ],
            include: [{
                model: Song,
                as: 'song',
                attributes: ['id', 'trackTitle', 'genre', 'plays', 'duration', 'imagePath'],
                where: { genre }, 
                include: [{
                    model: User,
                    as: 'Artist',
                    attributes: ['id', 'userName']
                }]
            }],
            group: ['songID', 'song.id', 'song.trackTitle', 'song.genre', 'song.plays', 'song.duration', 'song.imagePath', 'song->Artist.id', 'song->Artist.userName'],
            order: [
                [sequelize.fn('SUM', sequelize.col('totalListenTime')), 'DESC'],
                [sequelize.literal('MAX(timeListened)'), 'DESC']
            ],
            limit: 5
        });

        const listenedSongIDs = topListenedSongs.map(history => history.song.id);

        // Lấy thêm các bài hát cùng thể loại để đủ 10 bài
        const additionalSongs = await Song.findAll({
            where: {
                genre,
                id: {
                    [Op.notIn]: listenedSongIDs
                }
            },
            include: [{
                model: User,
                as: 'Artist',
                attributes: ['id', 'userName']
            }],
            order: [['plays', 'DESC']],
            limit: 10 - topListenedSongs.length
        });

        const response = {
            topListened: topListenedSongs.map(history => history.song),
            relatedSongs: additionalSongs,
            dominantGenre: genre
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error in getMixByGenre:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getTopGlobalMix = async (req, res) => {
    try {
        const { userID } = req.params;

        if (!userID) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        // Lấy danh sách bài hát xu hướng toàn cầu
        const globalTrendingSongs = await Song.findAll({
            attributes: ['id', 'trackTitle', 'genre', 'plays', 'duration', 'imagePath'],
            include: [{
                model: User,
                as: 'Artist',
                attributes: ['id', 'userName']
            }],
            order: [['plays', 'DESC']],
            limit: 10
        });

        // Lấy bài hát từ lịch sử người dùng (nếu có userID)
        let userHistorySongs = [];
        if (userID) {
            userHistorySongs = await History.findAll({
                where: {
                    listenerID: userID
                },
                attributes: [
                    'songID',
                    [sequelize.fn('MAX', sequelize.col('timeListened')), 'lastTimeListened'],
                    [sequelize.fn('SUM', sequelize.col('totalListenTime')), 'totalTime']
                ],
                include: [{
                    model: Song,
                    as: 'song',
                    attributes: ['id', 'trackTitle', 'genre', 'plays', 'duration', 'imagePath'],
                    include: [{
                        model: User,
                        as: 'Artist',
                        attributes: ['id', 'userName']
                    }]
                }],
                group: ['songID', 'song.id', 'song.trackTitle', 'song.genre', 'song.plays', 'song.duration', 'song.imagePath', 'song->Artist.id', 'song->Artist.userName'],
                order: [
                    [sequelize.fn('SUM', sequelize.col('totalListenTime')), 'DESC'],
                    [sequelize.literal('MAX(timeListened)'), 'DESC']
                ],
                limit: 5
            });
        }

        // Loại trừ các bài hát từ lịch sử đã có trong xu hướng toàn cầu
        const historySongIDs = userHistorySongs.map(history => history.song.id);
        const additionalSongs = globalTrendingSongs.filter(song => !historySongIDs.includes(song.id));

        // Gộp danh sách
        const response = {
            topListened: userHistorySongs.map(history => history.song),
            relatedSongs: additionalSongs,
            dominantGenre: null 
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in getTopGlobalMix:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
