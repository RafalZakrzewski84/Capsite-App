const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');

const Campground = require('../models/campground');


//connecting to mongoDB working on localhost
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { 
    //check these properties
    useNewUrlParser: true,
    useUnifiedTopology: true
})
//notification if we are connected to db
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//help generate name of camp
const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    //cleaning database
    await Campground.deleteMany({});

    //loop for generating new document in mongo db
    for (let i=0; i <50; i++){
        const random1000 = Math.floor(Math.random()*1000);

        //new camp with name and location
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

//this function will fill db with data nad close connection with db
seedDB().then(() => {
    mongoose.connection.close()
});