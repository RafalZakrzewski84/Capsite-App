const mongoose = require('mongoose');

//add schema to variable
const Schema = mongoose.Schema;

//setting new schema for Campgrounds
const CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

//setting and exporting mongoose model
module.exports = mongoose.model('Campground', CampgroundSchema);
