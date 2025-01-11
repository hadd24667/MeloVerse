const express = require('express');
const { getTopSongs } = require('../controllers/TopSongController');
const { getSongsWithArtistAndFollowers, incrementPlayCount } = require('../controllers/getSongsWithArtistAndFollowers');
const { getSongByGenre } = require('../controllers/getSongByGenreController');

const router = express.Router();

router.get('/top-songs', getTopSongs);
router.get('/', getSongsWithArtistAndFollowers);
router.get('/genres/:genre', getSongByGenre);
router.post('/increment-play', incrementPlayCount);

module.exports = router;