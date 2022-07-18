/** @format */

const express = require('express');
const router = express.Router();

//adding passport package
const passport = require('passport');

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
		try {
			//data from register form
			const { username, email, password } = req.body;
			//creating new user
			const user = new User({ username, email });
			//registering new user by passport middleware
			const registeredUser = await User.register(user, password);
			// console.log(registeredUser);

			//automatic login after registering new user
			req.login(registeredUser, function (err) {
				if (err) {
					return next(err);
				}
				//greetings of new user
				req.flash('success', `Welcome ${username} in Yelp-Camp`);
				res.redirect('/campgrounds');
			});
		} catch (e) {
			//msg if registering process gone wrong
			req.flash('error', e.message);
			res.redirect('/register');
		}
	})
);

//setting login route
router.get('/login', (req, res) => {
	res.render('users/login');
});
//adding login logic - using passport method for auth
router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
		keepSessionInfo: true,
	}),
	(req, res) => {
		req.flash('success', 'Welcome back');

		//path to redirect user to page from before logging
		console.log('req.returnTO', req.session.returnTo);
		const redirectUrl = req.session.returnTo || '/campgrounds';
		console.log(redirectUrl);
		delete req.session.returnTo;
		res.redirect(redirectUrl);
	}
);

router.get('/logout', (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash('success', 'Goodbye');
		res.redirect('/campgrounds');
	});
});

module.exports = router;
