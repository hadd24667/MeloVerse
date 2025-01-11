const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    process.nextTick(() => {
        done(null, {
            id: user.id,
            userName: user.userName,
            imagePath: user.imagePath,
            email: user.email,
            role: user.role,
            profile: user.profile
        });
    });
});

passport.deserializeUser((user, done) => {
    process.nextTick(() => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ where: { email: profile.emails[0].value } });
            if (!user) {
                user = await User.create({
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    password: null, // Password not needed for OAuth users
                    role: 'listener',
                    imagePath: profile.photos[0].value
                });
            } else if (user.imagePath !== profile.photos[0].value) {
                // await user.update({ imagePath: profile.photos[0].value });
                await user.reload();
            }
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,  
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET, 
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ where: { email: profile.emails[0].value } });
            if (!user) {
                user = await User.create({
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    password: null,
                    role: 'listener',
                    imagePath: profile.photos[0].value
                });
            }
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

module.exports = passport;