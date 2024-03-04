const express = require('express');
const router = express.Router();
const mypageController = require('../controllers/mypage');
const isAuth = require('../middlewares/auth');
const mypageBoardController = require('../controllers/mypageBoard');
const mypageBookmarkController = require('../controllers/mypageBookmark');
// , isAuth
router.get('/', mypageController.get);
router.put('/', isAuth, mypageController.put);
router.get('/boards', isAuth, mypageBoardController.get);
router.get('/bookmarks', isAuth, mypageBookmarkController.get);

module.exports = router;
