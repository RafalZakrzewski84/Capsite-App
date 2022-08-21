/** @format */
//access to env file with secret variables in dev mode
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');

//adding session, flash to app and mongo as session storage
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

//adding layouts
const ejsMateEngine = require('ejs-mate');

//adding error class
const ExpressError = require('./utils/ExpressError');

//override methods in forms from
const methodOverride = require('method-override');

//importing mongoose
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

const helmet = require('helmet');

//importing user mongoose model
const User = require('./models/users');

//importing routes
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

//adding passports package for authentication
const passport = require('passport');
const localStrategy = require('passport-local');

//connecting to mongoDB Atlas
const db_url = 'mongodb://127.0.0.1:27017/yelp-camp';
//process.env.MONGO_ATLAS_URL
//'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(db_url, {
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
	store: MongoStore.create({
		mongoUrl: db_url,
		secret: 'sessionSecret',
		touchAfter: 24 * 3600,
	}),
	name: 'session',
	secret: 'sessionSecret',
	resave: false,
	saveUninitialized: true,
	//adding cookies
	cookie: {
		httpOnly: true,
		//secure: true,
		//current day + 7 days in milliseconds
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

//setting flash middleware
app.use(flash());

// setting helmet
// app.use(helmet());
app.use(helmet({ crossOriginEmbedderPolicy: false }));

const scriptSrcUrls = [
	'https://cdn.jsdelivr.net/',
	'https://api.tiles.mapbox.com/',
	'https://api.mapbox.com/',
	'https://kit.fontawesome.com/',
	'https://cdnjs.cloudflare.com/',
	'https://cdn.jsdelivr.net',
	'https://yelpcamp-git-zbhez.run-eu-central1.goorm.io/',
];
const styleSrcUrls = [
	'https://kit-free.fontawesome.com/',
	'https://cdn.jsdelivr.net/',
	'https://api.mapbox.com/',
	'https://api.tiles.mapbox.com/',
	'https://fonts.googleapis.com/',
	'https://use.fontawesome.com/',
	'https://yelpcamp-git-zbhez.run-eu-central1.goorm.io/',
];
const connectSrcUrls = [
	'https://api.mapbox.com/',
	'https://a.tiles.mapbox.com/',
	'https://b.tiles.mapbox.com/',
	'https://events.mapbox.com/',
	'https://yelpcamp-git-zbhez.run-eu-central1.goorm.io/',
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", 'blob:'],
			objectSrc: [],
			imgSrc: [
				"'self'",
				'blob:',
				'data:',
				'https://res.cloudinary.com/dj9mlzzp1/',
				'https://images.unsplash.com/',
				'https://yelpcamp-git-zbhez.run-eu-central1.goorm.io/',
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);

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

//$ and . characters are removed completely req.body,params,headers,query
app.use(mongoSanitize());

//homepage
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
