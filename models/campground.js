/** @format */

const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const Users = require('./users');

//add schema to variable
const Schema = mongoose.Schema;

//setting new schema for Campgrounds
const CampgroundSchema = new Schema({
	title: String,
	images: [
		{
			url: string,
			filename: string,
		},
	],
	price: Number,
	description: String,
	location: String,
	//author should be obj to have access to user in ejs file
	author: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
	},
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
