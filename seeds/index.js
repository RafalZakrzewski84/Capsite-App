/** @format */

//In terminal use commend node index.js or node seeds/index.js if you are outside seeds folder

const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const Campground = require('../models/campground');

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

//help generate name of camp
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	//cleaning database
	await Campground.deleteMany({});

	//loop for generating new document in mongo db
	for (let i = 0; i < 500; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 30) + 10;

		//new camp with name and location
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			title: `${sample(descriptors)} ${sample(places)}`,
			author: '62d513e62befb692d956d5a6',
			images: [
				{
					url: 'https://res.cloudinary.com/dj9mlzzp1/image/upload/v1660739852/Yelpcamp/edajiztuqavorhlnck9z.jpg',
					filename: 'Yelpcamp/edajiztuqavorhlnck9z',
				},
				{
					url: 'https://res.cloudinary.com/dj9mlzzp1/image/upload/v1660739853/Yelpcamp/kuxcchaozrkgcxkgwmzz.jpg',
					filename: 'Yelpcamp/kuxcchaozrkgcxkgwmzz',
				},
			],
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit eaque esse illo veritatis rem consequatur velit, magni impedit aperiam! Quam nulla deserunt impedit et illum dolorum beatae dolores accusantium a?',
			price,
		});
		await camp.save();
	}
};

//this function will fill db with data nad close connection with db
seedDB().then(() => {
	mongoose.connection.close();
});
