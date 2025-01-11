const User = require('../../models/user');
const Sequelize = require('sequelize');
const Song = require('../../models/song');
const Collaborator = require('../../models/collaborator');
const Album = require('../../models/album');
const Queue = require('../../models/queue');
const History = require('../../models/history');

const transporter = require('../../config/emailConfig');

const getAllSong = async (req, res) => {
    try {
        const songs = await Song.findAll({
            attributes: ['id', 'trackTitle', 'albumID', 'filePath', 'plays', 'duration', 'imagePath', 'artistID', 'releaseDate','lyrics'],
            include: [
                {
                    model: Album,
                    as: 'Album',
                    attributes: ['title']
                },
                {
                    model: User,
                    as: 'Artist',
                    attributes: ['userName'],
                    where: { id: Sequelize.col('Song.artistID') }
                }
            ]
        });

        const songIds = songs.map(song => song.id);

        const collaborators = await Collaborator.findAll({
            where: { songID: songIds },
            attributes: ['id', 'artistID', 'songID']
        });

        const artistIds = collaborators.map(collab => collab.artistID);

        const users = await User.findAll({
            where: { id: artistIds },
            attributes: ['id', 'userName', 'role', 'imagePath']
        });

        const response = songs.map(song => ({
            id: song.id,
            trackTitle: song.trackTitle,
            albumTitle: song.Album ? song.Album.title : null,
            plays: song.plays,
            duration: song.duration,
            imagePath: song.imagePath,
            artistName: song.Artist ? song.Artist.userName : null,
            filePath: song.filePath,
            releaseDate: song.releaseDate,
            lyrics: song.lyrics,
            collaborators: users.filter(user =>
                collaborators.some(collab => collab.songID === song.id && collab.artistID === user.id)
            ).map(user => ({
                userName: user.userName,
            }))
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
};

const deleteSong = async (req, res) => {
    const { id } = req.body;
    try {
        await Collaborator.destroy({
            where: {
                SongID: id,
            },
        });

        await Queue.destroy({
            where: {
                SongID: id,
            },
        });

        await History.destroy({
            where: {
                SongID: id,
            },
        });

        await Song.destroy({
            where: {
                id: id,
            },
        });
        res.status(200).json({ message: 'Song deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting album:', error);
        res.status(500).json({ error: 'Failed to delete album' });
    }
}

module.exports = {getAllSong, deleteSong};