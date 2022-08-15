/** @format */

const mongoose = require('mongoose');

//add schema to variable
const Schema = mongoose.Schema;

//setting new schema for reviews
const reviewSchema = new Schema({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
	},
});

module.exports = mongoose.model('Review', reviewSchema);
