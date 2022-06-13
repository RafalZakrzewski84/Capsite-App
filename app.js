const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');


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


//express app
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//basic page
app.get('/', (req,res) => {
    res.send('hello word')
})

//basic routes

//list of all campgrounds
app.get('/campgrounds', async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

//page with detailed information about comp
app.get('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show', {camp});
})


app.listen(3000, ()=>{
    console.log('App is listening on 3000 port.')
})