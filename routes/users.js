/** @format */

const express = require('express');
const router = express.Router();

//adding error class - catchAsync is wrapping every async function in code below
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//adding users schema
const User = require('../models/users');

//setting register route
router.get('/register', (req, res) => {
	res.render('users/register');
});
//adding data from register form to db - new user
router.post(
	'/register',
	catchAsync(async (req, res, next) => {
		const user = new User(req.body.register);
		res.send(user);
	})
);

module.exports = router;
