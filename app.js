const express = require('express');
const path = require('path');

//adding layouts
const ejsMateEngine = require('ejs-mate');

//override methods in forms from
const methodOverride = require('method-override');

//importing mongoose
const mongoose = require('mongoose');

//importing db schema
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

//setting engine to ejs and directory path to views
app.engine('ejs', ejsMateEngine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//for parsing data form page forms
app.use(express.urlencoded({extended: true}));
//we can change methods from browser 
app.use(methodOverride('_method'));

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


//page for adding new campground (before :id to prewent trigering .findById('new'))
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
//data from form from new camp page
app.post('/campgrounds', async (req,res) => {
    //new campground with data from from
    const camp = new Campground(req.body.campground);
    //saving new camp to db
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
})


//page with detailed information about comp
app.get('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show', {camp});
})


//editing existing camp
app.get('/campgrounds/:id/edit', async(req,res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {camp});
})
//updating particular camp and show details
app.put('/campgrounds/:id', async(req, res) =>{
    //id of camp for update
    const {id} = req.params;
    //finding and updating camp with new data from edit form
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${camp._id}`)
})


//deleting camp
app.delete('/campgrounds/:id', async(req,res) => {
    //camp by id
    const {id} = req.params;
    //find and delete from db
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


app.listen(3000, ()=>{
    console.log('App is listening on 3000 port.')
})