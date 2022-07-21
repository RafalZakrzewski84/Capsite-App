/** @format */

const express = require('express');
const router = express.Router();

//adding error class - catchAsync is wrapping every async function in code below
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//importing mongoose schema
const Campground = require('../models/campground');

//adding middleware for checking if user logged in
const { isLoggedIn } = require('../utils/middleware');

//adding joi schema - package for validating data from forms
const { campgroundJoiSchema } = require('../utils/schemasJOI');

//function for validating camp data using Joi schema
const validateCampground = (req, res, next) => {
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

//BASIC ROUTE
//list of all campgrounds
router.get(
	'/',
	catchAsync(async (req, res) => {
		//finding all campground in db
		const campgrounds = await Campground.find({});

		//render page with all campgrounds
		res.render('campgrounds/index', { campgrounds });
	})
);

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
			.populate('reviews')
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

//editing existing camp
router.get(
	'/:id/edit',
	isLoggedIn,
	catchAsync(async (req, res) => {
		//opening camp page by camp id
		const camp = await Campground.findById(req.params.id);

		//show flash error msg when campground not found
		if (!camp) {
			req.flash('error', 'Campground Not Found');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { camp });
	})
);
//updating particular camp and show details
router.put(
	'/:id',
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		//id of camp for update
		const { id } = req.params;
		const camp = await Campground.findById(id);
		if (!camp.author.equals(req.user._id)) {
			req.flash('error', "You don't have permission to edit campground");
			return res.redirect(`/campgrounds/${id}`);
		}

		//finding and updating camp with new data from edit form
		const campground = await Campground.findByIdAndUpdate(id, {
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
