/** @format */
//importing mongoose schema for campgrounds
const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
	//finding all campground in db
	const campgrounds = await Campground.find({});

	//render page with all campgrounds
	res.render('campgrounds/index', { campgrounds });
};
