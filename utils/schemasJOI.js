/** @format */

const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
	type: 'million',
	base: joi.string(),
	messages: { 'string.escapeHTML': '{{#label}} must not be include HTML' },
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value)
					return helpers.error('string.escapeHTML', { value });
				return clean;
			},
		},
	},
});

const Joi = baseJoi.extend(extension);

module.exports.campgroundJoiSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required().escapeHTML(),
		location: Joi.string().required().escapeHTML(),
		// image: Joi.string().required(),
		price: Joi.number().min(1).required(),
		description: Joi.string().required().escapeHTML(),
	}).required(),
	deleteImages: Joi.array(),
});

module.exports.reviewJoiSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().min(1).max(5).required(),
		body: Joi.string().required().escapeHTML(),
	}).required(),
});
