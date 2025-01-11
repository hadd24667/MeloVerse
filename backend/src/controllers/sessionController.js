const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken,verifyToken } = require('../config/jwt');
const sendEmail = require('../services/automatedEmail');

const signup = async (req, res) => {
    const { userName, password, role, profile, email } = req.body;

    if (!userName || !password || !role) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'artist' && (!profile || !email || !email.includes('@') || !email.includes('.'))) {
            return res.status(400).send({ error: 'Please fill out the profile and email fields correctly' });
        }

        if(role === 'artist'){
            const user = await User.create({
                userName,
                password: hashedPassword,
                role : 'listener',
                profile,
                email,
                artistRegister: true,
                requestDate: Date.now(),
            });
            await sendEmail(email, 'Artist Registration', 'Your registration is pending approval');
            return res.status(201).send({ message: 'Artist created successfully', user });

        }else{
            const user = await User.create({
                userName,
                password: hashedPassword,
                role
            });
            return res.status(201).send({ message: 'Listener created successfully', user });
        }
    } catch (error) {
        res.status(400).send({ error: 'Error creating user', details: error.message });
    }
};

const checkUserName = async (req, res) => {
    const { userName } = req.body;

    try {
        const user = await User.findOne({ where: { userName } });
        if (user) {
            return res.status(200).send({ exists: true });
        } else {
            return res.status(200).send({ exists: false });
        }
    } catch (error) {
        res.status(400).send({ error: 'Error checking userName', details: error.message });
    }
};

const checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(200).send({ exists: true });
        }else{
            return res.status(200).send({ exists: false });
        }
    } catch (error) {
        res.status(400).send({ error: 'Error checking email', details: error.message });
    }
}

const login = async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    try {
        const user = await User.findOne({ where: { userName } });
        if (!user) {
            return res.status(400).send({ error: 'Username or password is incorrect' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Username or password is incorrect' });
        }
        const token = generateToken(user);
        res.status(200).send({ message: 'Login successful', token });
    } catch (error) {
        res.status(400).send({ error: 'Error logging in', details: error.message });
    }
};

const getUserInfo = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("No token provided");
        return res.status(401).send({ error: 'UserAdmin not authenticated' });
    }

    try {
        console.log("Checking for JWT token");
        const decoded = verifyToken(token);
        console.log("Token verified, fetching user with ID:", decoded.id);

        // Truy vấn người dùng từ cơ sở dữ liệu dựa trên ID từ token
        const user = await User.findByPk(decoded.id);
        if (!user) {
            console.log("User not found in database");
            return res.status(404).send({ error: 'User not found' });
        }

        console.log("User fetched successfully");

        return res.status(200).send({
            id: user.id,
            userName: user.userName,
            email: user.email,
            role: user.role,
            imagePath: user.imagePath,
            profile: user.profile
        });
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(400).send({ error: 'Invalid token', details: error.message });
    }
};

const updateProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ error: 'User not authenticated' });
    }

    try {
        const decoded = verifyToken(token);

        const user = await User.findByPk(decoded.id);
        if(!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        //get data update from req.body
        const { userName, email, profile, imagePath } = req.body;
        console.log('Request Body:', req.body);

        if(!userName && !email && !profile && !imagePath) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        if(userName) user.userName = userName;
        if(email) user.email = email;
        if (profile) {
            console.log('log prf:', profile);
            user.profile = profile;
        }

        if(imagePath) user.imagePath = imagePath;

        await user.save();

        return res.status(200).send({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                imagePath: user.imagePath,
                profile: user.profile
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        return res.status(400).send({ error: 'Error updating profile', details: error.message });
    }
};


module.exports = { signup, checkUserName, login, getUserInfo, checkEmail, updateProfile };