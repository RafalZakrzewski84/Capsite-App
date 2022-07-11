/** @format */

const mongoose = require('mongoose');
const Review = require('./review');

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

//mongoose middleware for deleting reviews after deleting camp
CampgroundSchema.post('findOneAndDelete', async function (camp) {
	if (camp.reviews.length) {
		//if camp has reviews delete them form Review db finding review by id = id in camp.reviews id
		const result = await Review.deleteMany({ _id: { $in: camp.reviews } });
		console.log(result);
	}
});

//setting and exporting mongoose model
module.exports = mongoose.model('Campground', CampgroundSchema);
