const { Song, User, Album, Collaborator } = require('../models')
const Sequelize = require('sequelize');
const {Op} = require("sequelize");
const { Model, where } = require('sequelize');

const getSongsByArtist = async (req, res) => {
    try {
        const { artistID: userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'Missing artist ID' });
        }

        // Find songs by the given artistID
        const songs = await Song.findAll({
            where: { artistID: userId },
            attributes: ['id', 'trackTitle','albumID','filePath','lyrics', 'plays', 'duration', 'imagePath', 'artistID']
        });

        // Extract song IDs
        const songIds = songs.map(song => song.id);

        // Find collaborators for the found songs
        const collaborators = await Collaborator.findAll({
            where: { songID: songIds },
            attributes: ['id', 'artistID', 'songID']
        });

        // Extract artist IDs from collaborators
        const artistIds = collaborators.map(collab => collab.artistID);

        // Find user details for the collaborators
        const users = await User.findAll({
            where: { id: artistIds },
            attributes: ['id', 'userName', 'role', 'imagePath']
        });

        // Map songs to include collaborator details
        const response = songs.map(song => ({
            id: song.id,
            trackTitle: song.trackTitle,
            albumID: song.albumID,
            plays: song.plays,
            duration: song.duration,
            imagePath: song.imagePath,
            artistID: song.artistID,
            lyrics: song.lyrics,
            filePath: song.filePath,
            collaborators: users.filter(user =>
                collaborators.some(collab => collab.songID === song.id && collab.artistID === user.id)
            ).map(user => ({
                id: user.id,
                userName: user.userName,
                role: user.role,
                imagePath: user.imagePath
            }))
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
};

const getAllArtist = async (req, res) => {
    const { artistID } = req.body;
    try {
        const users = await User.findAll({
            where: { role: 'artist' ,
                    id: {
                        [Op.ne]: artistID
                    }
            },
            attributes: ['id', 'userName', 'role', 'imagePath']
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({ error: 'Failed to fetch artists' });
    }
};

const getAllArtistAlbums = async (req, res) => {
    const { artistID } = req.body;

    try {
        const albums = await Album.findAll({ where: { artistID } });
        res.status(200).json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ error: 'Failed to fetch albums' });
    }
};

module.exports = { getSongsByArtist, getAllArtist, getAllArtistAlbums };