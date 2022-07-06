/** @format */

const express = require('express');
//we will have access to campground id in router req.params
const router = express.Router({ mergeParams: true });

//importing mongoose schemas
const Campground = require('../models/campground');
const Review = require('../models/review');

//for error class - catchAsync is wrapping every async function in code below
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

//adding joi schema - package for validating data from forms
const { reviewJoiSchema } = require('../utils/schemasJOI');

//function for validating review data using Joi schema
const validateReview = (req, res, next) => {
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

//posting new review for camp
router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		//finding camp by id
		const camp = await Campground.findById(req.params.id);

		//creating review data from form
		const review = new Review(req.body.review);

		//adding review id to campground doc in db
		camp.reviews.push(review);

		//saving docs in db
		await review.save();
		await camp.save();

		//flash msq
		req.flash('success', 'New Review Added');
		res.redirect(`/campgrounds/${camp._id}`);
	})
);

//deleting review route
router.delete(
	'/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		//removing review id from campground reviews
		const camp = await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		console.log(id);
		//deleting review from db by its id taken from url
		await Review.findOneAndDelete(reviewId);

		// console.log(req.params);

		//flash msq
		req.flash('success', 'Review Successfully Deleted');
		res.redirect(`/campgrounds/${camp._id}`);
	})
);

module.exports = router;
