/** @format */
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

console.log(process.env);

const express = require('express');
const path = require('path');

//adding session and flash to app
const session = require('express-session');
const flash = require('connect-flash');

//adding layouts
const ejsMateEngine = require('ejs-mate');

//adding error class
const ExpressError = require('./utils/ExpressError');

//override methods in forms from
const methodOverride = require('method-override');

//importing mongoose
const mongoose = require('mongoose');

//importing user mongoose model
const User = require('./models/users');

//importing routes
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

//adding passports package for authentication
const passport = require('passport');
const localStrategy = require('passport-local');

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

//we can change from browser methods
app.use(methodOverride('_method'));

//using public directory with js files
app.use(express.static(path.join(__dirname, 'public')));

//adding session to app
const sessionConfig = {
	secret: 'sessionSecret',
	resave: false,
	saveUninitialized: true,
	//adding cookies
	cookie: {
		httpOnly: true,
		//current day + 7 days in milliseconds
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

//setting flash middleware
app.use(flash());

//setting passport middleware for auth
app.use(passport.initialize());
app.use(passport.session());
//passport will use for login passport-local on user mongoose schema
passport.use(new localStrategy(User.authenticate()));
//adding and removing user into session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//setting middleware for use variables accessible in templates rendered with res.render
app.use((req, res, next) => {
	//variables for flash msg
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');

	//variable for checking if user login
	res.locals.currentUser = req.user;
	next();
});

//BASIC PAGE
app.get('/', (req, res) => {
	res.render('home');
});

//campgrounds routes
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);

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
