/** @format */

const express = require('express');
const router = express.router();

//adding users schema
const User = require('../models/users');

//setting register route
router.get('/register', (req, res) => {
	res.render('users/register');
});

module.exports = router;
