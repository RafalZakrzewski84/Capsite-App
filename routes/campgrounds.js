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
router.get('/', catchAsync(campgrounds.renderCampListPage));

//page for adding new campground (before :id to prevent triggering .findById('new'))
router.get('/new', isLoggedIn, campgrounds.renderNewCampForm);
//data from form - new camp page
router.post(
	'/',
	isLoggedIn,
	validateCampground,
	catchAsync(campgrounds.createNewCamp)
);

//page with detailed information about comp
router.get('/:id', catchAsync(campgrounds.renderCampDetailsPage));

//editing existing camp when log in and you are author
router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.renderCampEditForm)
);
//updating particular camp and show details when log in and you are author
router.put(
	'/:id',
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(campgrounds.editCamp)
);

//deleting camp
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

module.exports = router;
