/** @format */

const express = require('express');
const router = express.Router();

//importing users controller
const users = require('../controllers/users');

//adding passport package
const passport = require('passport');

//adding error class - catchAsync is wrapping every async function in code below
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//adding users schema
const User = require('../models/users');

//setting register route
//adding data from register form to db - new user
router
	.route('/register')
	.get(users.renderRegisterForm)
	.post(catchAsync(users.registerUser));

//setting login route
//adding login logic - using passport method for auth
router
	.route('/login')
	.get(users.renderLoginForm)
	.post(
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
			keepSessionInfo: true,
		}),
		users.loginUser
	);

router.get('/logout', users.logoutUser);

module.exports = router;
