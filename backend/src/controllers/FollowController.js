const { User, Follow } = require('../models');

exports.followArtist = async (req, res) => {
    const { userID, artistID } = req.body;

    if (!userID || !artistID) {
        return res.status(400).send({ error: 'User ID and Artist ID are required' });
    }

    try {
        // Kiểm tra xem đã theo dõi chưa
        const existingFollow = await Follow.findOne({
            where: { listenerID: userID, artistID },
        });

        if (existingFollow) {
            return res.status(409).send({ error: 'You have already followed this artist' });
        }

        // Tạo bản ghi theo dõi mới
        const createFollow = await Follow.create({
            listenerID: userID,
            artistID,
        });

        if (createFollow) {
            return res.status(201).send({ message: 'Followed successfully' });
        } else {
            return res.status(500).send({ error: 'Failed to follow' });
        }

    } catch (error) {
        console.error(error); // Log lỗi trong server
        return res.status(500).send({
            error: 'Error following artist',
        });
    }
};

exports.unfollowArtist = async (req, res) => {
    const { userID, artistID } = req.body;

    if (!userID || !artistID) {
        return res.status(400).send({ error: 'User ID and Artist ID are required' });
    }

    try {
        // Kiểm tra xem người dùng có theo dõi nghệ sĩ hay không
        const existingFollow = await Follow.findOne({
            where: { listenerID: userID, artistID },
        });

        if (!existingFollow) {
            return res.status(404).send({ error: 'You have not followed this artist' });
        }

        // Unfollow
        const deleteFollow = await Follow.destroy({
            where: { listenerID: userID, artistID },
        });

        if (deleteFollow) {
            return res.status(200).send({ message: 'Unfollowed successfully' });
        } else {
            return res.status(500).send({ error: 'Failed to unfollow' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Lỗi khi thực hiện bỏ theo dõi nghệ sĩ.',
        });
    }
};

exports.followingArtists = async (req, res) => {
    const userID = req.query.userID;
    try {
        const follows = await Follow.findAll({
            where: { listenerID: userID },
            attributes: ['artistID'],
        });
        const artistIDs = follows.map(f => f.artistID); 
        res.status(200).json(artistIDs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching following list' });
    }
}
