const mongoose = require('mongoose');

//add schema to variable
const Schema = mongoose.Schema;

//setting new schema
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

//setting and exporting mongoose model
module.exports = mongoose.model('Campground', CampgroundSchema);