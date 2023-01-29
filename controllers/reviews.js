/** @format */

//importing mongoose schemas
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
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
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	//removing review id from campground reviews
	const camp = await Campground.findByIdAndUpdate(id, {
		$pull: { reviews: reviewId },
	});
	//deleting review from db by its id taken from url
	await Review.findOneAndDelete(reviewId);

	// console.log(req.params);

	//flash msq
	req.flash('success', 'Review Successfully Deleted');
	res.redirect(`/campgrounds/${camp._id}`);
};
