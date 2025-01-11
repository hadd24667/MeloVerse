const Song = require('../models/song');
const User = require('../models/user');


const getTopSongs = async (req, res) => {
    try {

        //retrieve artist
        const artist = await User.findAll({
            attributes: ['id', 'userName'],
        });

        const artistMap = {};
        artist.forEach(artist => {
            artistMap[artist.id] = artist.userName;
        });
        console.log(artistMap);

        //retrieve top songs
        const topSongs = await Song.findAll({
            order: [['plays', 'DESC']], 
            limit: 10,
            attributes:[ 'id', 'imagePath', 'filePath', 'trackTitle', 'artistID', 'plays', 'duration'],
        });
        //get top 1 song
        const top1Song = topSongs.length > 0 ? {
            id: topSongs[0].id,
            trackTitle: topSongs[0].trackTitle,
            imagePath: topSongs[0].imagePath,
            plays: topSongs[0].plays,
            artist: artistMap[topSongs[0].artistID] || 'Unknown ArtistAdmin',
        } : null;

        const top10Songs = topSongs.map(song => ({
            id: song.id,
            trackTitle: song.trackTitle,
            imagePath: song.imagePath,
            artist: artistMap[song.artistID] || 'Unknown ArtistAdmin',
            duration: song.duration,
        }))
        console.log('log log' + artistMap);

        res.status(200).json(
          {
            message: 'Top songs fetched successfully',
            top1: top1Song,
            top10: top10Songs
          }  
        );
    } catch (error) {
        console.error('Error fetching top songs:', error);
        res.status(500).json({
            message: 'Error fetching top songs',
            error: error.message,
        });
    }
};

module.exports = { getTopSongs };