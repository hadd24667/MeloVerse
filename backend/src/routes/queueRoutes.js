const express = require('express');
const { addSongToQueue, getQueue, shuffleQueue, removeSongFromQueue, clearQueue, getNextSong } = require('../controllers/QueueController');
const { get } = require('./songRoutes');
const router = express.Router();

router.post('/queue/add', addSongToQueue);
router.get('/queue', getQueue);
router.post('/queue/shuffle',shuffleQueue);
router.delete('/queue/remove', removeSongFromQueue);
router.delete('/queue/clear', clearQueue);
router.post('/queue/next', getNextSong);

module.exports = router;