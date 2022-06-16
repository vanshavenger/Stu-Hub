const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedin, validateRemarks, isRemarkAuthor } = require('../middleware');
const remarkControl = require('../controllers/remarkControl');

router.post('/', isLoggedin, validateRemarks, wrapAsync(remarkControl.createRemark));

router.delete('/:remarkid', isLoggedin, isRemarkAuthor, wrapAsync(remarkControl.deleteRemark));

module.exports = router;