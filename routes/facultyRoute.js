const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedin, validateFaculty, isAuthorF } = require('../middleware');
const { storage } = require('../cloudinaryConfig/index');
const facultyControl = require('../controllers/facultyControl');

const multer = require('multer');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(facultyControl.indexFaculty))
    .post( isLoggedin,upload.array('image'), validateFaculty, wrapAsync(facultyControl.createNewFaculty))

router.get('/new', isLoggedin, wrapAsync(facultyControl.newFacultyPage));


router.route('/:id')
    .get( wrapAsync(facultyControl.showFaculty))
    .put(isLoggedin, isAuthorF,upload.array('image'), validateFaculty, wrapAsync(facultyControl.editFaculty))
    .delete(isLoggedin, isAuthorF, wrapAsync(facultyControl.deleteFaculty))


router.get('/:id/edit', isLoggedin, isAuthorF, wrapAsync(facultyControl.facultyEditPage));

module.exports = router;