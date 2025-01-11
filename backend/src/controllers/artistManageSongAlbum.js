const Album = require('../models/album');
const Song = require('../models/song');
const User = require('../models/user');
const Collaborator = require('../models/collaborator');
const Queue = require("../models/queue");
const Follow = require('../models/follow');

const updateAlbum = async (req, res) => {
    const { title, albumID, imagePath, description } = req.body;

    if (!title|| !albumID || !imagePath || !description) {
        return res.status(400).json({ error: 'cant update album' });
    }

    const album = await Album.update({
        title,
        imagePath,
        description,
    }, {
        where: {
            id: albumID,
        },
    });

    res.json(album);
}

const deleteAlbum = async (req, res) => {
    const { albumID } = req.body;

    console.log(albumID);

    if (!albumID) {
        return res.status(400).json({ error: 'cant delete album' });
    }

    try {
        await Song.destroy({
            where: {
                AlbumID: albumID,
            },
        }).then(async (songs) => {
            for (let i = 0; i < songs.length; i++) {
                await Collaborator.destroy({
                    where: {
                        SongID: songs[i].id,
                    },
                });
            }
        });
        console.log("1");
        await Album.destroy({
            where: {
                id: albumID,
            },
        });

        res.json({ message: 'album deleted' });
    } catch (error) {
        res.status(500).json({ error: 'failed to delete album' });
    }
}

const updateSong = async (req, res) => {
    const  payload  = req.body;
    console.log(payload);
    console.log(payload.songID);

    if (!payload.trackTitle || !payload.songID || !payload.filePath || !payload.imagePath) {
        return res.status(400).json({ error: 'Cant update song' });
    }

    try{
        console.log("0");
        const song = await Song.update({
            trackTitle : payload.trackTitle,
            duration : payload.duration,
            filePath : payload.filePath,
            imagePath : payload.imagePath,
            lyrics : payload.lyrics,
            AlbumID : payload.albumID,
        }, {
            where: {
                id: payload.songID,
            },
        });

        console.log("1");

        await Collaborator.destroy({
            where: {
                SongID: payload.songID,
            },
        });

        console.log("2");

        if (payload.collaborators && payload.collaborators.length > 0) {
            for (const collaborator of payload.collaborators) {
                const collab = await User.findOne({ where: { id: collaborator} });
                if (collab) {
                    await Collaborator.create({
                        songID: payload.songID,
                        artistID: collab.id,
                    });
                }
            }
        }

        console.log("3");

        res.json({ message: 'Updated successful!' });
    }catch (error) {
        res.status(500).json({ error: 'failed to update song' }, error);
    }
};

const deleteSong = async (req, res) => {
    const { songID } = req.body;

    console.log(songID);
    console.log("delete song");

    if (!songID) {
        return res.status(400).json({ error: 'cant delete song' });
    }

    try {
        await Collaborator.destroy({
            where: {
                SongID: songID,
            },
        });

        console.log("1");

        await Queue.destroy({
            where: {
                SongID: songID,
            },
        });
        console.log("2");
        await Song.destroy({
            where: {
                id: songID,
            },
        });

        res.json({ message: 'song deleted' });
    } catch (error) {
        res.status(500).json({ error: 'failed to delete song' }, error);
    }
}

const getFollowers = async (req, res) => {
    const { artistID } = req.body;

    if (!artistID) {
        return res.status(400).json({ error: 'cant get followers' });
    }

    try {
        const followers = await Follow.count({
            where: {
                artistID,
            },
        });

        res.json(followers);
    } catch (error) {
        res.status(500).json({ error: 'failed to get followers' });
    }
}

module.exports = { updateAlbum, updateSong, deleteSong, deleteAlbum, getFollowers };