const User = require('../../models/user');
const Sequelize = require('sequelize');
const Song = require('../../models/song');
const Collaborator = require('../../models/collaborator');
const Album = require('../../models/album');
const Queue = require('../../models/queue');

const getAllAlbum = async (req, res) => {
    try {
        const albums = await Album.findAll({
            attributes: ['id', 'title', 'imagePath', 'releaseDate', 'artistID','description'],
            include: [
                {
                    model: User,
                    as: 'Artist',
                    attributes: ['userName'],
                    where: { id: Sequelize.col('Album.artistID') }
                }
            ]
        });

        const response = albums.map(album => ({
            id: album.id,
            title: album.title,
            imagePath: album.imagePath,
            releaseDate: album.releaseDate,
            artistName: album.Artist ? album.Artist.userName : null,
            description: album.description
        }));

        res.status(200).json(response);
    }catch (e) {
        console.error('Error fetching pending approvals:', e);
    }
}

const getAlbumSongs = async (req, res) => {
    try {
        const { albumID: id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Missing album ID' });
        }

        const songs = await Song.findAll({
            where: { albumID: id },
            attributes: ['id', 'trackTitle', 'albumID', 'filePath', 'lyrics', 'plays', 'duration', 'imagePath', 'artistID'],
            include: [
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
            attributes: ['id', 'userName']
        });

        const response = songs.map(song => {

            const songCollaborators = collaborators
                .filter(collab => collab.songID === song.id)
                .map(collab => users.find(user => user.id === collab.artistID)?.userName)
                .filter(Boolean);

            return {
                id: song.id,
                trackTitle: song.trackTitle,
                albumID: song.albumID,
                plays: song.plays,
                duration: song.duration,
                imagePath: song.imagePath,
                artistName: song.Artist ? song.Artist.userName : null,
                lyrics: song.lyrics,
                filePath: song.filePath,
                collaborators: songCollaborators,
            };
        });

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
};

const deleteAlbum = async (req, res) => {
    try {
        const { albumID: id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Missing album ID' });
        }

        await Album.destroy({
            where: { id } ,
        });

        const songs = await Song.findAll({
            where: { albumID: id },
            attributes: ['id']
        });

        await Queue.destroy({
            where: { albumID: id }
        });

        await Collaborator.destroy({
            where: { songID: songs.map(song => song.id) }
        });

        await Song.destroy({
            where: { albumID: id }
        });

        res.status(200).json({ message: 'Album deleted successfully' });
    } catch (error) {
        console.error('Error deleting album:', error);
        res.status(500).json({ error: 'Failed to delete album' });
    }
}

module.exports = {getAllAlbum,getAlbumSongs,deleteAlbum};