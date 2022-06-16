const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedin, validateUsers, isAuthorU } = require('../middleware');
const { storage } = require('../cloudinaryConfig/index');
const userControl = require('../controllers/userControl');

const multer = require('multer');
const upload = multer({ storage });

router.get('/', wrapAsync(userControl.indexUsers));

router.get('/new', isLoggedin, wrapAsync(userControl.newUserPage));

router.post('/', isLoggedin, upload.array('image'), validateUsers, wrapAsync(userControl.createNewUser));

router.get('/:id', wrapAsync(userControl.showUser));

router.get('/:id/edit', isLoggedin, isAuthorU, wrapAsync(userControl.editUserPage));

router.put('/:id', isLoggedin, isAuthorU,upload.array('image'), validateUsers, wrapAsync(userControl.editUser));

router.delete('/:id', isLoggedin, isAuthorU, wrapAsync(userControl.deleteUser));

module.exports = router;