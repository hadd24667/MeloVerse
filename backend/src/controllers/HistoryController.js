const { History, Song, User } = require('../models');

// Lấy lịch sử nghe nhạc
exports.getHistory = async (req, res) => {
    const { userID } = req.params;
    console.log('userID: ', userID);
    try {
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const histories = await History.findAll({
            where: { listenerID: userID },
            order: [['timeListened', 'DESC']],
            limit: 15,
            include: [
                {
                    model: Song,
                    as: 'song',
                    attributes: ['id', 'trackTitle', 'imagePath', 'duration', 'plays'],
                    include: [
                        {
                            model: User,
                            as: 'Artist',
                            attributes: ['id', 'userName']
                        }
                    ]
                }
            ]
        });
        console.log('Histories found:', histories);
        res.status(200).json(histories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Lưu lịch sử nghe nhạc
exports.saveHistory = async (req, res) => {
    const { songID, userID, listenTime } = req.body;

    if (!songID || !userID) {
        return res.status(400).json({ message: "Song ID and User ID are required" });
    }

    try {
        const [history, created] = await History.findOrCreate({
            where: { listenerID: userID, songID },
            defaults: {
                timeListened: new Date(),
                totalListenTime: listenTime || 0,
            },
        });

        if (!created) {
            // Nếu đã tồn tại, cập nhật thông tin
            history.timeListened = new Date();
            history.totalListenTime += listenTime || 0;
            await history.save();
        }

        res.status(created ? 201 : 200).json(history);
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            // Xử lý lỗi ràng buộc duy nhất nếu xảy ra
            return res.status(409).json({ message: "Duplicate entry detected" });
        }

        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Cập nhật thời gian nghe nhạc
exports.updateListenTime = async (req, res) => {
    const { songID, userID, listenTime } = req.body;

    if (!songID) {
        return res.status(400).json({ message: 'Song ID is required' });
    }

    if (!userID) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Kiểm tra lịch sử đã tồn tại chưa
        const existingHistory = await History.findOne({
            where: { listenerID: userID, songID },
        });

        if (existingHistory) {
            // Cập nhật totalListenTime nếu đã tồn tại
            existingHistory.totalListenTime += listenTime || 0;
            await existingHistory.save();
            console.log('Listen time updated:', existingHistory);
            return res.status(200).json(existingHistory);
        }

        console.log('History not found for update');
        res.status(404).json({ message: 'History not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};