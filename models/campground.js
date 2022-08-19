/** @format */

const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const Users = require('./users');
const opts = { toJSON: { virtuals: true } };

//add schema to variable
const Schema = mongoose.Schema;

//separate schema for images
const ImagesSchema = new Schema({
	url: String,
	filename: String,
});
//using virtual property for generating thumbnail url for images
ImagesSchema.virtual('imgThumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200');
});

//setting new schema for Campgrounds
const CampgroundSchema = new Schema(
	{
		title: String,
		images: [ImagesSchema],
		price: Number,
		description: String,
		location: String,

		//must follow GeoJSON pattern
		//Mongoose schema where location
		geometry: {
			type: {
				type: String, // Don't do `{ location: { type: String } }`
				enum: ['Point'], // 'location.type' must be 'Point'
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
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
	},
	opts
);

//using virtual property for generating GeoJSON properties for cluster map
CampgroundSchema.virtual('properties.popupMarkup').get(function () {
	return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
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
