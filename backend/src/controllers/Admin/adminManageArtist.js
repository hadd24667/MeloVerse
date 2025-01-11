const User = require('../../models/user');
const Follow = require('../../models/follow');
const Sequelize = require('sequelize');
const Song = require('../../models/song');
const Queue = require('../../models/queue');
const Collaborator = require('../../models/collaborator');
const Album = require('../../models/album');

const bcrypt = require('bcrypt');

const getAllArtistInfo = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: 'artist' },
            attributes: ['id', 'userName', 'role', 'imagePath','profile']
        });

        const followCounts = await Follow.findAll({
            attributes: ['artistID', [Sequelize.fn('COUNT', Sequelize.col('id')), 'followers']],
            group: ['artistID']
        });

        const usersWithFollowersAndTopSong = await Promise.all(users.map(async user => {
            const followCount = followCounts.find(follow => follow.artistID === user.id);
            const topSong = await Song.findOne({
                where: { artistID: user.id },
                order: [
                    ['plays', 'DESC'],
                    ['releaseDate', 'DESC']
                ],
                attributes: ['trackTitle']
            });

            return {
                ...user.toJSON(),
                followers: followCount ? followCount.dataValues.followers : 0,
                topSong: topSong ? topSong.trackTitle : 'Don\'t have any album'
            };
        }));

        res.status(200).json(usersWithFollowersAndTopSong);
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({ error: 'Failed to fetch artists' });
    }
};

const getArtistSongs = async (req, res) => {
    try {
        const { artistID: userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'Missing artist ID' });
        }

        // Find songs by the given artistID
        const songs = await Song.findAll({
            where: { artistID: userId },
            attributes: ['id', 'trackTitle', 'albumID', 'filePath', 'lyrics', 'plays', 'duration', 'imagePath', 'artistID']
        });

        // Extract album IDs
        const songIds = songs.map(song => song.id);

        // Find collaborators for the found songs
        const collaborators = await Collaborator.findAll({
            where: { songID: songIds },
            attributes: ['artistID', 'songID']
        });

        // Extract artist IDs from collaborators
        const artistIds = collaborators.map(collab => collab.artistID);

        // Find user details for the collaborators
        const users = await User.findAll({
            where: { id: artistIds },
            attributes: ['id', 'userName']
        });

        // Map songs to include collaborator details
        const response = songs.map(song => {
            const songCollaborators = collaborators
                .filter(collab => collab.songID === song.id)
                .map(collab => users.find(user => user.id === collab.artistID)?.userName)
                .filter(Boolean); // Remove undefined values

            return {
                id: song.id,
                trackTitle: song.trackTitle,
                albumID: song.albumID,
                plays: song.plays,
                duration: song.duration,
                imagePath: song.imagePath,
                artistID: song.artistID,
                lyrics: song.lyrics,
                filePath: song.filePath,
                collaborators: songCollaborators
            };
        });

        // response.forEach(album => {
        //     console.log("Collaborators for album", album.trackTitle, ":", album.collaborators);
        // });

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
};

const updateArtist = async (req, res) => {
    try {
        const { id, userName, profile, imagePath } = req.body;
        const artist = await User.findByPk(id);
        artist.userName = userName;
        artist.profile = profile;
        artist.imagePath = imagePath;
        await artist.save();

        res.status(200).json({ message: 'Artist updated successfully' });
    } catch (error) {
        console.error('Error updating artist:', error);
        res.status(500).json({ error: 'Failed to update artist' });
    }
};

const deleteArtist = async (req, res) => {
    try {
        const { id } = req.body;
        console.log("ID",id);

        const user = await User.findByPk(id);

        const queues = await Queue.destroy({
            where: { listenerID: user.id }
        });

        const collaborators = await Collaborator.destroy({
            where: { artistID: user.id  }
        });

        const albums = await Album.destroy({
            where: { artistID: user.id  }
        });

        const follows = await Follow.destroy({
            where: { artistID: user.id  }
        });

        const songs = await Song.destroy({
            where: { artistID: user.id  }
        });

        const artist = await User.destroy({
            where: { id : user.id  }
        });

        res.status(200).json({ message: 'Artist deleted successfully' });
    } catch (error) {
        console.error('Error deleting artist:', error);
        res.status(500).json({ error: 'Failed to delete artist' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: 'listener' },
            attributes: ['id', 'userName', 'role', 'imagePath','profile']
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching listeners:', error);
        res.status(500).json({ error: 'Failed to fetch listeners' });
    }
};

const createNewUser = async (req, res) => {
    try {
        const { userName, role, profile, imagePath } = req.body;

        const password = '123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({userName, hashedPassword, role, profile, imagePath });

        res.status(200).json({ message: 'Artist created successfully', user });
    } catch (error) {
        console.error('Error creating artist:', error);
        res.status(500).json({ error: 'Failed to create artist' });
    }
};

module.exports = { getAllArtistInfo, getArtistSongs , updateArtist, deleteArtist};