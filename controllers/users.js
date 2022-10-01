/** @format */

//adding passport package
const passport = require('passport');
//adding users schema
const User = require('../models/users');

module.exports.renderRegisterForm = (req, res) => {
	res.render('users/register');
};

module.exports.registerUser = async (req, res, next) => {
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
			req.flash('success', `Welcome ${username} To Campsite App`);
			res.redirect('/campgrounds');
		});
	} catch (e) {
		//msg if registering process gone wrong
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

module.exports.renderLoginForm = (req, res) => {
	res.render('users/login');
};

module.exports.loginUser = (req, res) => {
	req.flash('success', 'Welcome back');

	//path to redirect user to page from before logging
	const redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash('success', 'Goodbye');
		res.redirect('/campgrounds');
	});
};
