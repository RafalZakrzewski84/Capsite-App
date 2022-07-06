/** @format */

const express = require('express');
const path = require('path');

//adding layouts
const ejsMateEngine = require('ejs-mate');

//adding error class
const ExpressError = require('./utils/ExpressError');

//override methods in forms from
const methodOverride = require('method-override');

//importing mongoose
const mongoose = require('mongoose');

//importing routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./models/review');

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

//BASIC PAGE
app.get('/', (req, res) => {
	res.render('home');
});

//campgrounds routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

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
