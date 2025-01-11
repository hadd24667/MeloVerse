
import { User, Song, Album, Favourite } from '../models';

exports.setFavourite = async (req, res) => {
    const { listenerID, songID, albumID, artistID } = req.body;

    try {
        // Kiểm tra xchỉ cho phép một trong ba trường songID, albumID, artistID được set
        const items = [songID, albumID, artistID].filter(Boolean);
        if (items.length !== 1) {
            return res.status(400).json({ message: 'Only one of songID, albumID, or artistID must be set' });
        }

        // Kiểm tra đã có trong danh sách yêu thích chưa
        const existingFavourite = await Favourite.findOne({
            where: {
                listenerID,
                ...(songID && { songID }),
                ...(albumID && { albumID }),
                ...(artistID && { artistID }),
            }
        });

        if (existingFavourite) {
            return res.status(400).json({ message: 'Already in favourites' });
        }

        // Thêm vào danh sách yêu thích
        const favourite = await Favourite.create({
            listenerID,
            ...(songID && { songID }),
            ...(albumID && { albumID }),
            ...(artistID && { artistID }),
        });

        res.status(201).json({ message: 'Added to favourites', favourite });

    } catch (error) {
        console.error('Error setting favourite:', error);
        res.status(500).json({ message: 'Error setting favourite', error });
    }
}

exports.deleteFavourite = async (req, res) => {
    const { listenerID, songID, albumID, artistID } = req.body;

    try {
        const result = await Favourite.destroy({
            where: {
                listenerID,
                ...(songID && { songID }),
                ...(albumID && { albumID }),
                ...(artistID && { artistID })
            }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Favourite not found' });
        }

        res.status(200).json({ message: 'Removed from favourites' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFavourites = async (req, res) => {
    const { listenerID } = req.params;

    try {
        const favourites = await Favourite.findAll({
            where: { listenerID },
            include: [
                {
                    model: Song,
                    as: 'song',
                    attributes: ['id', 'trackTitle', 'imagePath', 'artistID', 'duration'],
                    include: [{
                        model: User,
                        as: 'Artist',
                        attributes: ['id', 'userName']
                    }]
                },
                {
                    model: Album,
                    as: 'album',
                    attributes: ['id', 'title', 'imagePath', 'artistID'],
                    include: [{
                        model: User,
                        as: 'Artist',
                        attributes: ['id', 'userName']
                    }]
                },
                {
                    model: User,
                    as: 'artist',
                    attributes: ['id', 'userName', 'imagePath']
                }
            ],
            limit: 10,
        });

        res.status(200).json(favourites);

    } catch (error) {
        console.error('Error getting favourites:', error);
        res.status(500).json({ message: error.message });
    }
};