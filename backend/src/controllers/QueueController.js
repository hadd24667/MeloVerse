const { Song, Queue, User, sequelize } = require('../models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.addSongToQueue = async (req, res) => {
    const { userID, songID } = req.body;

    if (!userID || !songID) {
        return res.status(400).send({ error: 'User ID and Song ID are required' });
    }

    try {
        // Kiểm tra bài hát đã tồn tại trong queue chưa
        const isExistSong = await Queue.findOne({ where: { listenerID: userID, songID } });
        if (isExistSong) {
            return res.status(400).send({ error: 'Song already in queue' });
        }

        // Thêm bài hát vào đầu queue
        await sequelize.transaction(async (t) => {
            await Queue.increment('position', {
                by: 1,
                where: { listenerID: userID },
                transaction: t,
            });

            await Queue.create({
                listenerID: userID,
                songID,
                position: 0,
            }, { transaction: t });
        });

        return res.status(200).send({ message: 'Song added to the beginning of the queue' });
    } catch (error) {
        console.error("Error adding song to queue:", error);
        return res.status(500).send({ error: 'Failed to add song to queue' });
    }
};


exports.getQueue = async (req, res) => {
    const { userID } = req.query;

    if (!userID) {
        return res.status(400).send({ error: 'User ID is required' });
    }

    try {
        const queue = await Queue.findAll({
            where: { listenerID: userID },
            include: [
                {
                    model: Song,
                    as: 'Song',
                    attributes: ['id', 'trackTitle', 'genre', 'imagePath'],
                    include: [
                        {
                            model: User,
                            as: 'Artist',
                            attributes: ['id', 'userName'],
                        },
                    ],
                },
            ],
        });

        return res.status(200).send({
            message: 'Queue retrieved successfully',
            data: queue
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to retrieve queue' });
    }
}

exports.getNextSong = async (req, res) => {
    const { userID, currentSongId } = req.body;

    if (!userID || !currentSongId) {
        return res.status(400).send({ error: 'User ID and Current Song ID are required' });
    }

    try {
        const queue = await Queue.findAll({
            where: { listenerID: userID },
            order: [['position', 'ASC']],
            include: {
                model: Song,
                as: 'Song',
            },
        });

        const currentIndex = queue.findIndex((item) => item.Song.id === parseInt(currentSongId));

        if (currentIndex === -1) {
            return res.status(404).send({ error: 'Current song not found in queue' });
        }

        const nextIndex = (currentIndex + 1) % queue.length;
        const nextSong = queue[nextIndex];

        return res.status(200).send({
            message: 'Next song retrieved successfully',
            data: nextSong,
        });
    } catch (error) {
        console.error("Error retrieving next song:", error);
        return res.status(500).send({ error: 'Failed to retrieve next song' });
    }
};


exports.removeSongFromQueue = async (req, res) => {
    const { userID, songID } = req.body;

    try {
        const deletedSong = await Queue.destroy({
            where: { listenerID: userID, songID }
        });

        if (deletedSong) {

            const remainingQueue = await Queue.findAll({
                where: { listenerID: userID },
                order: [['position', 'ASC']]
            });

            await Promise.all(
                remainingQueue.map((queueEntry, index) =>
                    queueEntry.update({ position: index })
                )
            );

            res.status(200).json({ message: 'Song removed from queue' });
        } else {
            res.status(400).json({ error: 'Song not found in queue' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove song from queue', error: error.message });
    }
}

exports.shuffleQueue = async (req, res) => {
    const { userID, currentSongId } = req.body;
    console.log("Request body:", req.body);


    if (!userID || !currentSongId) {
        return res.status(400).send({ error: 'User ID and Current Song ID are required' });
    }

    try {
        console.log("Received shuffle request for userID:", userID, "and currentSongId:", currentSongId);

        //get genre of current song
        const currentSong = await Song.findByPk(currentSongId);
        if (!currentSong) {
            return res.status(400).send({ error: 'Current song not found' });
        }
        //get 20 songs of genre of current song
        const relatedSongs = await Song.findAll({
            where: {
                genre: currentSong.genre,
                id: { [Op.ne]: currentSongId },
            },
            order: Sequelize.literal('RAND()'),
            limit: 20,
        });

        console.log("Related songs fetched:", relatedSongs);

        //delete old queue
        await Queue.destroy({ where: { listenerID: userID } });
        //add new queue
        const newQueue = [
            await Queue.create({
                listenerID: userID,
                songID: currentSongId,
                position: 0,
            }),
        ];

        //add another song into queue
        for (let i = 0; i < relatedSongs.length; i++) {
            const song = relatedSongs[i];
            newQueue.push(
                await Queue.create({
                    listenerID: userID,
                    songID: song.id,
                    position: i + 1,
                })
            );
        }
        console.log("New queue created:", newQueue);

        return res.status(200).send({
            message: 'Queue shuffled successfully',
            data: newQueue
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to shuffle queue', error: error.message });
    }
}

exports.clearQueue = async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).send({ error: 'User ID is required' });
    }

    try {
        await Queue.destroy({ where: { listenerID: userID } });
        res.status(200).json({ message: 'Queue cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to clear queue', error: error.message });
    }
};
