const { Op } = require('sequelize');
const { User, Song, Album } = require('../models');

exports.search = async (req, res) => {
    const { type, query } = req.query;

    if (!query) {
        return res.status(400).send({ error: 'Missing query' });
    }

    try {
        let results = {};
        // switch case to handle different search types
        switch (type?.toLowerCase()) {

            // song
            case 'song':
                results = {
                    song: await Song.findAll({
                        where: {
                            trackTitle: { [Op.like]: `%${query}%` },
                        },
                        include: [
                            {
                                model: User,
                                as: 'Artist',
                                attributes: ['id', 'userName'],
                            },
                        ],                        
                        attributes: ['id', 'trackTitle', 'artistID', 'imagePath', 'duration'],
                        limit: 20,
                    }),
                };
                break;
            
            // artist
            case 'artist':
                results = {
                    artists: await User.findAll({
                        where: {
                            userName: {
                                [Op.like]: `%${query}%`,
                            }, 
                            role: 'artist',
                        },
                        attributes: ['id', 'userName', 'imagePath'],
                        limit: 20,
                    }),
                };
                break;
            
            // album    
            case 'album':
                results = {
                    albums: await Album.findAll({
                        where: {
                            title: {
                                [Op.like]: `%${query}%`,
                            },
                        },
                        include: [
                            {
                                model: User,
                                as: 'Artist',
                                attributes: ['id', 'userName'],
                            },
                        ],     
                        attributes: ['id', 'title', 'artistID', 'imagePath'],
                        limit: 20,
                    }),
                };
                break;

            default:
                // return all results if type is not specified
                results = {
                    songs: await Song.findAll({
                        where: {
                            trackTitle: {
                                [Op.like]: `%${query}%`,
                            },
                        },
                        include: [
                            {
                                model: User,
                                as: 'Artist',
                                attributes: ['id', 'userName'],
                            },
                        ],                        
                        attributes: ['id', 'trackTitle', 'artistID', 'imagePath', 'duration'],
                        limit: 10,
                    }),
                    artists: await User.findAll({
                        where: {
                            userName: {
                                [Op.like]: `%${query}%`,
                            },
                            role: 'artist',
                        },
                        attributes: ['id', 'userName', 'imagePath'],
                        limit: 10,
                    }),
                    albums: await Album.findAll({
                        where: {
                            title: {
                                [Op.like]: `%${query}%`,
                            },
                        },
                        include: [
                            {
                                model: User,
                                as: 'Artist',
                                attributes: ['id', 'userName'],
                            },
                        ],    
                        attributes: ['id', 'title', 'artistID', 'imagePath'],
                        limit: 10,
                    }),
                };
                break;
        }
        res.status(200).json(results);
    } catch (error) {
        console.error('Search API Error:', error);
        res.status(500).json({ error: 'An error occurred while performing the search.' });
    }
}