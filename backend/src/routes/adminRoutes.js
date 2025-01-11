const express = require('express');
const router = express.Router();
const { getNumberOfAll, getSongRelease } = require('../controllers/getStatistic');
const { getAllArtistInfo , getArtistSongs , updateArtist, deleteArtist} = require('../controllers/Admin/adminManageArtist');
const { getAllSong, deleteSong} = require('../controllers/Admin/adminManageSong');
const {getPendingApproval,acceptArtist,rejectArtist} = require('../controllers/Admin/adminPendingApproval');
const {getAllUser, deleteUser} = require('../controllers/Admin/manageUser');
const {getAllAlbum,getAlbumSongs,deleteAlbum} = require('../controllers/Admin/adminManageAlbum');

router.get('/get-statistic', getNumberOfAll);
router.get('/get-song-release', getSongRelease);
router.get('/get-artist-info', getAllArtistInfo);
router.post('/get-artist-songs', getArtistSongs);
router.post('/update-artist', updateArtist);
router.post('/delete-artist', deleteArtist);

router.get('/get-pending-approval', getPendingApproval);
router.post('/accept-artist', acceptArtist);
router.post('/reject-artist', rejectArtist);

router.get('/get-all-user', getAllUser);
router.post('/delete-user', deleteUser);

router.get('/get-all-song', getAllSong);
router.post('/delete-song', deleteSong);

router.get('/get-all-album', getAllAlbum);
router.post('/get-album-songs', getAlbumSongs);
router.post('/delete-album', deleteAlbum);

module.exports = router;