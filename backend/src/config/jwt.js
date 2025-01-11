const jwt = require('jsonwebtoken');
const secretKey = 'Meloverse_secret_key';

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        userName: user.userName,
        imagePath: user.imagePath,
        profile: user.profile
    }, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };