/** @format */

const express = require('express');
const path = require('path');

//adding layouts
const ejsMateEngine = require('ejs-mate');

//adding joi and joi schemas - package for validating data from forms
const Joi = require('joi');
const { campgroundJoiSchema, reviewJoiSchema } = require('./utils/schemasJOI');

//adding error class - catchAsync is wrapping every async function in code below
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

//override methods in forms from
const methodOverride = require('method-override');

//importing mongoose
const mongoose = require('mongoose');

//importing mongoose schemas
const Campground = require('./models/campground');
const Review = require('./models/review');

//importing routes
const campground = require('./routes/campgrounds');

//connecting to mongoDB working on localhost
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
	//check these properties
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//notification if we are connected to db
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

//express app
const app = express();

//setting engine to ejs and directory path to views
app.engine('ejs', ejsMateEngine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//app middleware
//for parsing data form page forms
app.use(express.urlencoded({ extended: true }));
//we can change methods from browser
app.use(methodOverride('_method'));

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

//BASIC PAGE
app.get('/', (req, res) => {
	res.render('home');
});

//campgrounds routes
app.use('/campgrounds', campgrounds);

//posting new review for camp
app.post(
	'/campgrounds/:id/reviews',
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

		res.redirect(`/campgrounds/${camp._id}`);
	})
);

//deleting review route
app.delete(
	'/campgrounds/:id/reviews/:reviewId',
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
		res.redirect(`/campgrounds/${camp._id}`);
	})
);

//Error, if route doesn't match to paths above
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

//error handling
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Sth Went Wrong';
	res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
	console.log('App is listening on 3000 port.');
});
