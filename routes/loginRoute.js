const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const passport = require("passport");
const loginControl = require('../controllers/loginControl');

router.get("/register", loginControl.registerPage);

router.post('/register', wrapAsync(loginControl.register))

router.get("/login", loginControl.loginPage);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), wrapAsync(loginControl.login));

router.get('/logout', loginControl.logout);
module.exports = router;