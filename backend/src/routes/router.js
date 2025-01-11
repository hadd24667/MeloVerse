const express = require('express');
const passport = require('../config/passport');  // Import passport with Google strategy
const { signup, checkUserName, checkEmail, login, getUserInfo,updateProfile} = require('../controllers/sessionController');
const { getSongsByArtist, getAllArtist, getAllArtistAlbums } = require('../controllers/getDataController');
const { uploadSong, updateLyrics , uploadAlbum} = require('../controllers/UploadController');
const { followArtist, unfollowArtist, followingArtists } = require('../controllers/FollowController');
const { search } = require('../controllers/searchController');
const { getTopAlbum, getAlbumDetails } = require('../controllers/getAlbumController');
const { getPopularArtists, getArtistDetails } = require('../controllers/PopularArtistController');
const { getHistory, saveHistory, updateListenTime } = require('../controllers/HistoryController');
const { getMegamix, getMixByGenre, getTopGlobalMix } = require('../controllers/MadeForController');
const { setFavourite, deleteFavourite, getFavourites } = require('../controllers/FavouriteController');
const { createPlaylist, searchSongInPlaylist, addSongToPlaylist, getSongsInPlaylist, removeSongFromPlaylist, getAllPlaylists, updatePlaylist, getPlaylistDetails } = require('../controllers/PlaylistController');
const router = express.Router();
const {generateToken} = require('../config/jwt');
const songRoutes = require('./songRoutes');

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.post('/signup', signup);
router.post('/check-username', checkUserName);
router.post('/check-email', checkEmail);
router.post('/login', login);
router.get('/userinfo', getUserInfo);

router.put('/update-profile', updateProfile);

// Upload routes
router.post('/upload-song', uploadSong);
router.post('/artist-upload-album', uploadAlbum);
router.post('/get-artist-songs', getSongsByArtist);
router.post('/get-all-artist-albums', getAllArtistAlbums);
router.post('/update-lyrics', updateLyrics);
router.post('/get-all-artist', getAllArtist);

// Follow routes
router.post('/follow', followArtist);
router.post('/unfollow', unfollowArtist);
router.get('/following', followingArtists);

// Search routes
router.get('/search', search);

// Album routes
router.get('/top-albums', getTopAlbum);
router.get('/get-album-details/:albumID', getAlbumDetails)

// Artist routes
router.get('/get-popular-artists', getPopularArtists);
router.get('/get-artist-details/:artistID', getArtistDetails);

// History routes
router.get('/history/:userID', getHistory);
router.post('/save-history', saveHistory);
router.post('/update-history', updateListenTime);

// Made for you routes
router.get('/mega-mix/:userID', getMegamix);
router.get('/genre-mix/:userID/:genre', getMixByGenre);
router.get('/global-mix/:userID', getTopGlobalMix);

// Playlist routes
router.post('/create-playlist', createPlaylist);
router.get('/search-song-in-playlist', searchSongInPlaylist);
router.post('/add-song-to-playlist', addSongToPlaylist);
router.get('/playlist/:playlistID', getSongsInPlaylist);
router.delete('/remove-song-from-playlist', removeSongFromPlaylist);
router.get('/all-playlists/:userID', getAllPlaylists);
router.put('/playlist/:playlistID', updatePlaylist);
router.get('/playlist-details/:playlistID', getPlaylistDetails);

// Favorite routes
router.post('/add-fav', setFavourite);
router.delete('/remove-fav', deleteFavourite);
router.get('/fav/:listenerID', getFavourites);

router.post('/upload-song', uploadSong);
router.post('/artist-upload-album', uploadAlbum);
router.post('/get-artist-songs', getSongsByArtist);
router.post('/get-all-artist-albums', getAllArtistAlbums);
router.post('/update-lyrics', updateLyrics);
router.post('/get-all-artist', getAllArtist);

router.use('/songs', songRoutes);

module.exports = router;
