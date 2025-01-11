const User = require('../../models/user');
const sendEmail = require('../../services/automatedEmail');

const getPendingApproval = async (req, res) => {
    try {
        const pendingApproval = await User.findAll({
            where: {
                artistRegister: true
            },
            attributes: ['userName', 'profile', 'email', 'requestDate']
        });
        res.status(200).send(pendingApproval);
    } catch (error) {
        res.status(400).send({ error: 'Error getting pending approval', details: error.message });
    }
}

const acceptArtist = async (req, res) => {
    const { userName } = req.body;

    try {
        const user = await User.findOne({
            where: {
                userName
            }
        });

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        await User.update(
            {
                artistRegister: false,
                role: 'artist'
            },
            {
                where: {
                    userName
                }
            }
        );

        await sendEmail(user.email, 'Your artist registration has been accepted!', 'We are pleased to inform you that your registration request was accepted. You can now upload your music and share it with the world');

        res.status(200).send({ message: 'Artist accepted successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error accepting artist', details: error.message });
    }
}

const rejectArtist = async (req, res) => {
    const { userName } = req.body;

    try {
        const user = await User.findOne({
                where: {
                    userName
                }
            }
        );

        if (!user) {
            return res.status(400).send({error: 'User not found'});
        }

        await User.destroy({
            where: {
                userName
            }
        });

        await sendEmail(user.email, 'Your artist registration has been denied:(', 'We regret to inform you that your registration request was denied due to some of our guidelines');

        res.status(200).send({message: 'Artist rejected successfully'});
    }catch (error) {
        res.status(400).send({error: 'Error rejecting artist', details: error.message});
    }
}

module.exports = {getPendingApproval,acceptArtist,rejectArtist};