const { Song, User } = require('../models');

const getSongByGenre = async (req, res) => {
    const genre = req.params.genre;

    if( !genre) {
        return res.status(400).send({ error: 'Genre is required' });
    }
    try {
        const songByGenre = await Song.findAll({
            where: { genre: genre },
            attributes: ['id', 'trackTitle', 'imagePath', 'duration'],
            order: [['plays', 'DESC']], 
            limit: 20,
            include: [
               {
                model: User,
                as: 'Artist',
                attributes: ['id', 'userName']
               }
            ],
        });
        console.log(songByGenre);
        if (!songByGenre.length) {
            return res.status(404).send({ message: 'No songs found for this genre' });
        }
        

        return res.status(200).send({
            message: 'Song by genre retrieved successfully',
            data: songByGenre
        });
    } catch (error) {
        console.error('Error in getSongByGenre:', error.message, error.stack);
        return res.status(500).send({ error: 'Failed to retrieve song by genre' });
    }
}

module.exports = { getSongByGenre };