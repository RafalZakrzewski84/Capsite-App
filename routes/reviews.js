/** @format */

const express = require('express');
//we will have access to campground id in router req.params
const router = express.Router({ mergeParams: true });

//importing reviews controller
const reviews = require('../controllers/reviews');

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
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//deleting review route only if logged in and author of review
router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	catchAsync(reviews.deleteReview)
);

module.exports = router;
