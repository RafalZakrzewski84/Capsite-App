/** @format */

const express = require('express');
const router = express.Router();

//importing cloudinary storage
const { storage } = require('../utils/cloudinary');

//import multer package for handling "multipart/form-data" in form
const multer = require('multer');
const upload = multer({ storage: storage });

//importing controllers for campgrounds
const campgrounds = require('../controllers/campgrounds');

//catchAsync is wrapping every async function in code below
const catchAsync = require('../utils/catchAsync');

//adding middleware for checking if user logged in
const {
	isLoggedIn,
	validateCampground,
	isAuthor,
} = require('../utils/middleware');

//BASIC ROUTE
//list of all campgrounds
router
	.route('/')
	.get(catchAsync(campgrounds.renderCampListPage))
	.post(
		isLoggedIn,
		upload.array('image'),
		validateCampground,
		catchAsync(campgrounds.createNewCamp)
	);

//page for adding new campground (before :id to prevent triggering .findById('new'))
router.get('/new', isLoggedIn, campgrounds.renderNewCampForm);

//page with detailed information about comp
//updating particular camp and show details when log in and you are author
//deleting camp
router
	.route('/:id')
	.get(catchAsync(campgrounds.renderCampDetailsPage))
	.put(
		isLoggedIn,
		isAuthor,
		validateCampground,
		catchAsync(campgrounds.editCamp)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

//editing existing camp when log in and you are author
router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.renderCampEditForm)
);

module.exports = router;
