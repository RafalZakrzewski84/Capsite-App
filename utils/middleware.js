/** @format */

//adding joi schema - package for validating data from forms
const { campgroundJoiSchema, reviewJoiSchema } = require('./schemasJOI');
//adding error class
const ExpressError = require('./ExpressError');
//importing mongoose schema
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		//remembering path before redirecting to login in session
		req.session.returnTo = req.originalUrl;

		req.flash('error', 'You must be signed in first');
		return res.redirect('/login');
	}
	next();
};

//function for validating camp data using Joi schema
module.exports.validateCampground = (req, res, next) => {
	//Joi function for validating campground Joi schema
	const { error } = campgroundJoiSchema.validate(req.body);
	// console.log(error.details);

	//generating error if validation failed
	if (error) {
		const errorValidationMsg = error.details.map((el) => el.message).join('; ');
		throw new ExpressError(errorValidationMsg, 400);
	} else {
		next();
	}
};

//checking if user is author of campground
module.exports.isAuthor = async (req, res, next) => {
	//id of camp for update
	const { id } = req.params;
	const camp = await Campground.findById(id);
	if (!camp.author.equals(req.user._id)) {
		req.flash('error', "You don't have permission to edit campground");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

//checking if user is author of review
module.exports.isReviewAuthor = async (req, res, next) => {
	//id of camp for update
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', "You don't have permission to delete campground");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

//function for validating review data using Joi schema
module.exports.validateReview = (req, res, next) => {
	//Joi function for validating review Joi schema
	const { error } = reviewJoiSchema.validate(req.body);
	// console.log(error.details);

	//generating error if validation failed
	if (error) {
		const errorValidationMsg = error.details.map((el) => el.message).join('; ');
		throw new ExpressError(errorValidationMsg, 400);
	} else {
		next();
	}
};
