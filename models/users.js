/** @format */

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//add schema to variable
const Schema = mongoose.Schema;

//we define email in schema rest will be added by passport package
const userSchema = new Schema({
	email: {
		type: String,
		required: [true, "Email can't be blank"],
		unique: true,
	},
});

//passport will plugin username and password to db
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', userSchema);
