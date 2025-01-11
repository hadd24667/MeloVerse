const express = require('express');
const router = express.Router();
const {updateAlbum, updateSong, deleteSong, deleteAlbum, getFollowers } = require('../controllers/artistManageSongAlbum');

router.post('/update-album', updateAlbum);
router.post('/update-song', updateSong);
router.post('/delete-song', deleteSong);
router.post('/delete-album', deleteAlbum);

router.post('/get-followers', getFollowers);

module.exports = router;