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
		const { username, email, password } = req.body;
		const user = new User({ username, email });
		const registeredUser = await User.register(user, password);
		console.log(registeredUser);
		req.flash('success', 'Welcome in Yelp-Camp');
		res.redirect('/campgrounds');
	})
);

module.exports = router;
