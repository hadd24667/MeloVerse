const User = require('../../models/user');
const sendEmail = require('../../services/automatedEmail');
const {Op} = require("sequelize");

const getAllUser = async (req, res) => {
    try {
        const allUser = await User.findAll({
            attributes: ['userName', 'imagePath', 'role', 'email', 'profile'],
            where: {
                role: {
                    [Op.ne]: 'admin' // Loại trừ các user có role là 'admin'
                }
            }
        });
        res.status(200).send(allUser);
    } catch (error) {
        res.status(400).send({ error: 'Error getting all user', details: error.message });
    }
};

const deleteUser = async (req, res) => {
    const {userName} = req.body;

    try {
        const user = await User.destroy({
                where: {
                    userName
                }
            }
        );
        res.status(200).send({message: 'User deleted successfully'});
    } catch (error) {
        res.status(400).send({error: 'Error deleting user', details: error.message});
    }
}

module.exports = {getAllUser, deleteUser};