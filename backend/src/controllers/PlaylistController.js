const { Playlist_Song, Song, Playlist } = require('../models');
const { Op } = require('sequelize');
const User = require('../models/user');

// Tạo playlist mặc địnhđịnh
exports.createPlaylist = async (req, res) => {
    try {
        const { userID } = req.body;

        const playlist = await Playlist.create({ 
            listenerID: userID,
            title: "Your Playlist #" + Math.floor(Math.random() * 10000),
            timeCreated: new Date()
        });

        res.status(200).json({ message: 'Playlist created successfully', playlist });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create playlist', details: error.message });
    }
};

// Tìm kiếm bài hát để đưa vào playlistplaylist
exports.searchSongInPlaylist = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const response = await Song.findAll({
            where: {
                trackTitle: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: ['id', 'trackTitle', 'duration', 'imagePath'],
            include: [{
                model: User,
                as: 'Artist',
                attributes: ['id', 'userName']
            }]
        });

        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to search song', details: error.message });
    }
}


// Thêm bài hát vào playlist
exports.addSongToPlaylist = async (req, res) => {
    const { playlistID, songID } = req.body;

    if (!playlistID || !songID) {
        return res.status(400).json({ error: 'playlistID and songID are required' });
    }

    try {
        const [playlist_song, created] = await Playlist_Song.findOrCreate({
            where: { 
                playlistID,
                songID 
            },
            defaults: {
                timeAdded: new Date()
            }
        });

        if (!created) {
            return res.status(400).json({ error: 'Song already exists in playlist' });
        }

        const song = await Song.findByPk(songID, {
            attributes: ['id', 'trackTitle', 'artistID', 'imagePath', 'duration', 'filePath']
        });

        res.status(201).json({
            message: 'Song added successfully',
            song
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add song to playlist', details: error.message });
    }
}

// Xóa bài hát khỏi playlist
exports.removeSongFromPlaylist = async (req, res) => {
    const { playlistID, songID } = req.body;

    if (!playlistID || !songID) {
        return res.status(400).json({ error: 'playlistID and songID are required' });
    }

    try {
        const playlist = await Playlist.findByPk(playlistID);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        const song = await Song.findByPk(songID);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        await Playlist_Song.destroy({
            where: {
                playlistID,
                songID
            }
        });

        res.status(200).json({ message: 'Song removed from playlist successfully', playlist });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to remove song from playlist', details: error.message });
    }
}

// Lấy danh sách bài hát trong playlist
exports.getSongsInPlaylist = async (req, res) => {
    const { playlistID } = req.params;

    if (!playlistID) {
        return res.status(400).json({ error: 'playlistID is required' });
    }

    try {
        const playlist = await Playlist.findByPk(playlistID, {
            include: [{
                model: Song,
                through: { attributes: ['timeAdded'] },
                attributes: [
                    'id',
                    'trackTitle',
                    'artistID',
                    'imagePath',
                    'duration',
                    'filePath'
                ],
                include: [{
                    model: User,
                    as: 'Artist',
                    attributes: ['id', 'userName']
                }]
            }],
            order: [[Song, Playlist_Song, 'timeAdded', 'DESC']]
        });

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        res.status(200).json({
            message: 'Songs retrieved successfully',
            songs: playlist.Songs
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            error: 'Failed to get songs from playlist', 
            details: error.message 
        });
    }
}

exports.getAllPlaylists = async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        return res.status(400).json({ error: 'userID is required' });
    }

    try {
        const playlists = await Playlist.findAll({
            where: { listenerID: userID },
            attributes: ['id', 'title', 'timeCreated', 'imagePath'],
            order: [['timeCreated', 'DESC']]
        });

        if (!playlists) {
            return res.status(404).json({ error: 'Playlists not found' });
        }

        res.status(200).json({
            message: 'Playlists retrieved successfully',
            playlists
        })
    } catch (error) {
        
    }
}
exports.updatePlaylist = async (req, res) => {
    const { playlistID } = req.params;
    const { title, imagePath } = req.body;

    if (!playlistID) {
        return res.status(400).json({ error: 'playlistID is required' });
    }

    try {
        const playlist = await Playlist.findByPk(playlistID);
        
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Update playlist data
        const updatedPlaylist = await playlist.update({
            title: title || playlist.title,
            imagePath: imagePath || playlist.imagePath,
            timeUpdated: new Date()
        });

        res.status(200).json({
            message: 'Playlist updated successfully',
            playlist: updatedPlaylist
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            error: 'Failed to update playlist', 
            details: error.message 
        });
    }
}
exports.getPlaylistDetails = async (req, res) => {
    const { playlistID } = req.params;
    try {
        const playlist = await Playlist.findByPk(playlistID, {
            include: [{
                model: Song,
                through: { attributes: ['timeAdded'] },
                include: [{
                    model: User,
                    as: 'Artist',
                    attributes: ['id', 'userName']
                }]
            }]
        });
        
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        res.status(200).json({
            playlist: {
                id: playlist.id,
                title: playlist.title,
                imagePath: playlist.imagePath,
                timeCreated: playlist.timeCreated
            },
            songs: playlist.Songs
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get playlist details' });
    }
};