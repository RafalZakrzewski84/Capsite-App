/** @format */

const mongoose = require('mongoose');

//add schema to variable
const Schema = mongoose.Schema;

//setting new schema for reviews
const reviewSchema = new Schema({
	body: String,
	rating: Number,
});

module.exports = mongoose.model('Review', reviewSchema);
