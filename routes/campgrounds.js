/** @format */

const express = require('express');
const router = express.Router();

//importing controllers for campgrounds
const campgrounds = require('../controllers/campgrounds');

//catchAsync is wrapping every async function in code below
const catchAsync = require('../utils/catchAsync');

//importing mongoose schema
const Campground = require('../models/campground');

//adding middleware for checking if user logged in
const {
	isLoggedIn,
	validateCampground,
	isAuthor,
} = require('../utils/middleware');

//BASIC ROUTE
//list of all campgrounds
router.get('/', catchAsync(campgrounds.index));

//page for adding new campground (before :id to prevent triggering .findById('new'))
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});
//data from form - new camp page
router.post(
	'/',
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res, next) => {
		//new campground with data from from
		const camp = new Campground(req.body.campground);

		//assigning logged in user as a creator of campground (req.user added by passport.authenticate() in routes users.js)
		camp.author = req.user._id;

		//saving new camp to db
		await camp.save();

		//flash msq
		req.flash('success', 'New Campground Added');
		res.redirect(`/campgrounds/${camp._id}`);
	})
);

//page with detailed information about comp
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;

		//finding campground in db by it id - id come from url (req.params)
		//populating reviews data and author
		const camp = await Campground.findById(id)
			.populate({
				path: 'reviews',
				populate: {
					path: 'author',
				},
			})
			.populate('author');
		console.log(camp);

		//show flash error msg when campground not found
		if (!camp) {
			req.flash('error', 'Campground Not Found');
			return res.redirect('/campgrounds');
		}
		//rendering page with camp details
		res.render('campgrounds/show', { camp });
	})
);

//editing existing camp when log in and you are author
router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		//opening camp page by camp id
		const camp = await Campground.findById(id);

		//show flash error msg when campground not found
		if (!camp) {
			req.flash('error', 'Campground Not Found');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { camp });
	})
);
//updating particular camp and show details when log in and you are author
router.put(
	'/:id',
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(async (req, res) => {
		//finding and updating camp with new data from edit form
		const camp = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});

		//flash msq
		req.flash('success', 'Campground Edited Successfully');
		res.redirect(`/campgrounds/${camp._id}`);
	})
);

//deleting camp
router.delete(
	'/:id',
	isLoggedIn,
	catchAsync(async (req, res) => {
		//camp by id
		const { id } = req.params;
		//find and delete from db
		const camp = await Campground.findByIdAndDelete(id);

		//flash msq
		req.flash('success', 'Campground Successfully Deleted');
		res.redirect('/campgrounds');
	})
);

module.exports = router;
