const Song = require('../models/Song');
const User = require('../models/User');
const Album = require('../models/Album');
const Collaborator = require('../models/collaborator');

const uploadSong = async (req, res) => {
    const { trackTitle, artist, musicURL, lyricsContent, imageURL, genre, releaseDate, collaborators, albumID, duration } = req.body;

    if (!trackTitle || !artist || !musicURL || !imageURL || !releaseDate || !genre || !duration) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    try {
        const user = await User.findOne({ where: { id: artist } });
        if (!user) {
            return res.status(400).send({ error: 'UserAdmin not found' });
        }

        const song = await Song.create({
            trackTitle,
            artistID: user.id,
            albumID,
            filePath: musicURL,
            lyrics: lyricsContent,
            imagePath: imageURL,
            genre,
            releaseDate,
            duration,
        });

        if (collaborators && collaborators.length > 0) {
            for (const collaborator of collaborators) {
                const collab = await User.findOne({ where: { id: collaborator } });
                if (collab) {
                    await Collaborator.create({
                        songID: song.id,
                        artistID: collab.id,
                    });
                }
            }
        }

        res.status(201).send({ message: 'Song uploaded successfully', song });
    } catch (error) {
        console.error('Error uploading song:', error);
        res.status(400).send({ error: 'Error uploading song', details: error.message });
    }
};


const uploadAlbum = async (req, res) => {
    const { artist, title, imagePath, releaseDate, description, tracks } = req.body;

    if (!artist || !title || !imagePath || !releaseDate || !description) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    try {
        const user = await User.findOne({ where: { id: artist } });
        if (!user) {
            return res.status(400).send({ error: 'UserAdmin not found' });
        }

        const album = await Album.create({
            artistID: user.id,
            title,
            imagePath,
            releaseDate,
            description,
        });

        if (tracks && tracks.length > 0) {
            console.log('Uploading tracks:', tracks);
            for (const track of tracks) {
                const songData = {
                    trackTitle: track.title,
                    artist: user.id,
                    musicURL: track.audio,
                    lyricsContent: track.lyrics,
                    imageURL: track.image,
                    genre: track.genre,
                    releaseDate,
                    collaborators: track.artists,
                    duration: track.duration,
                    position: track.position,
                };
                await uploadTrackAlbum( songData, album.id);
            }
        }

        res.status(201).send({ message: 'Album uploaded successfully', album });
    } catch (error) {
        console.error('Error uploading album:', error);
        res.status(400).send({ error: 'Error uploading album', details: error.message });
    }
};


const updateLyrics = async (req, res) => {
    const { songId, lyrics } = req.body;

    if (!songId || !lyrics) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    try {
        const song = await Song.findByPk(songId);
        if (!song) {
            return res.status(404).send({ error: 'Song not found' });
        }

        song.lyrics = lyrics;
        await song.save();

        res.status(200).send({ message: 'Lyrics updated successfully', song });
    } catch (error) {
        console.error('Error updating lyrics:', error);
        res.status(500).send({ error: 'Error updating lyrics', details: error.message });
    }
};

const uploadTrackAlbum = async (songData, albumID) => {
    const { trackTitle, artist, musicURL, lyricsContent, imageURL, genre, releaseDate, collaborators, duration, position } = songData;

    if (!trackTitle || !artist || !musicURL || !imageURL || !releaseDate || !genre || !duration) {
        throw new Error('Missing required fields');
    }

    try {
        const user = await User.findOne({ where: { id: artist } });
        if (!user) {
            throw new Error('UserAdmin not found');
        }

        const song = await Song.create({
            trackTitle,
            artistID: user.id,
            albumID,
            filePath: musicURL,
            lyrics: lyricsContent,
            imagePath: imageURL,
            genre,
            releaseDate,
            duration,
            position,
        });

        if (collaborators && collaborators.length > 0) {
            for (const collaborator of collaborators) {
                const collab = await User.findOne({ where: { id: collaborator } });
                if (collab) {
                    await Collaborator.create({
                        songID: song.id,
                        artistID: collab.id,
                    });
                }
            }
        }

        return song;
    } catch (error) {
        console.error('Error uploading song:', error);
        throw error;
    }
};

module.exports = { uploadSong, updateLyrics, uploadAlbum };