/** @format */

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		//remembering path before redirecting to login in session
		req.session.returnTo = req.originalUrl;

		req.flash('error', 'You must be signed in first');
		return res.redirect('/login');
	}
	next();
};
