const { Song, User, Follow, History } = require('../models')
const Sequelize = require('sequelize');
const getSongsWithArtistAndFollowers  = async (req, res) => {
    try {
        const songId = req.query.id;
        if (!songId) {
            return res.status(400).json({
                message: 'Missing song ID',
            });
        }

       const song = await Song.findAll({
        attributes: {
            include: [
                [Sequelize.fn('COUNT', Sequelize.col('Artist->Followers.id')), 'followerCount'],
            ],
        },
        include: [
            {
                model: User,
                as: 'Artist',
                attributes: ['id', 'userName', 'imagePath'],
                include: [
                    {
                        model: Follow,
                        as: 'Followers',
                        attributes: [],
                    },
                ],
            },
        ],
        where: { id: songId },
        group: ['Song.id', 'Artist.id'],
       })
       res.status(200).json(song);
    } catch (error) {
        console.error('Cannot get song data: ', error);
        res.status(500).json({
            message: 'cannot get data',
            error: error.message,
        });
    }
}

const incrementPlayCount = async (req, res) => {
    const { songID, userID } = req.body;
    try {
        const song = await Song.findByPk(songID);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        const lastHistory = await History.findOne({
            where: { listenerID: userID, songID },
            order: [['timeListened', 'DESC']],
        });

        const currentTime = new Date();
        const lastPlayed = lastHistory ? new Date(lastHistory.createdAt) : new Date(0);
        const duration = song.duration * 1000; // Convert duration to milliseconds

        if (currentTime - lastPlayed > duration) {
            song.plays += 1;
            await song.save();
            // Use findOrCreate instead of create
            const [history, created] = await History.findOrCreate({
                where: { 
                    listenerID: userID, 
                    songID: songID 
                },
                defaults: {
                    timeListened: currentTime,
                    totalListenTime: 0
                }
            });

            if (!created) {
                // Update existing history
                history.timeListened = currentTime;
                await history.save();
            }
            
            return res.status(200).json({ message: 'Play count incremented', plays: song.plays });
        } else {
            return res.status(200).json({ message: 'Play count not incremented', plays: song.plays });
        }
    } catch (error) {
        console.error('Error incrementing play count:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { getSongsWithArtistAndFollowers, incrementPlayCount };