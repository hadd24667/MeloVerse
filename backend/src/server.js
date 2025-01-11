const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const sequelize = require('./config/database');
const sessionRouter = require('./routes/router');
const { generateToken } = require('./config/jwt');
const dotenv = require('dotenv');
const songRoutes = require('./routes/songRoutes');
const queueRoutes = require('./routes/queueRoutes');
const artistRoutes = require('./routes/artistRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(session({
    secret: 'Meloverse_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', sessionRouter);
app.use('/api', songRoutes);
app.use('/api', queueRoutes);
app.use('/api', artistRoutes);
app.use('/api/admin', adminRoutes);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        res.send(`
            <script>
                window.opener.postMessage({ token: '${token}' }, 'http://localhost:5173');
                window.close();
            </script>
        `);
    }
);

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        res.send(`
            <script>
                window.opener.postMessage({ token: '${token}' }, 'http://localhost:5173');
                window.close();
            </script>
        `);
    }
);

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("App is running at the port http://localhost:" + port);
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Lỗi server nội bộ',
        error: err.message,
    });
});
