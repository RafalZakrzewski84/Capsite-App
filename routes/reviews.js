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

//adding middleware for checking if user logged in
const {
	isLoggedIn,
	validateReview,
	isReviewAuthor,
} = require('../utils/middleware');

//posting new review for camp
router.post(
	'/',
	isLoggedIn,
	validateReview,
	catchAsync(async (req, res) => {
		//finding camp by id
		const camp = await Campground.findById(req.params.id);

		//creating review data from form and adding author
		const review = new Review(req.body.review);
		review.author = req.user._id;
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

//deleting review route only if logged in and author of review
router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
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
