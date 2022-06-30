const Joi = require('joi');

module.exports.campgroundJoiSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		location: Joi.string().required(),
		image: Joi.string().required(),
		price: Joi.number().min(1).required(),
		description: Joi.string().required(),
	}).required(),
});

module.exports.reviewJoiSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().min(1).max(5).required(),
		body: Joi.string().required(),
	}).required(),
});
