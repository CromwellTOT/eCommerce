const express = require("express");
const User = require('../service/user/model');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const router = express.Router();


router.post("/", async (req, resp) => {
	console.log(`user: ${req.body.email} requsts login`);

	const user = await User.findOne({
	    email: req.body.email,
	    password: req.body.password,
	});

	if (user) {
		await generateTokenAndStoreInCookie(resp, user);
		
		resp.send({
			_id: user.id,
			name: user.name,
			email: user.email,
			userType: user.userType,
		});
	} else {
		resp.status(401).send({ error_message: 'Invalid Email or Password.', });
	}
});

function generateTokenAndStoreInCookie(resp, user) {
	const expiration = 604800000; // cookie will be removed after 7 days

	const token = jwt.sign({
			_id: user._id,
			name: user.name,
			email: user.email,
			userType: user.userType
	    }, 
	    config.jwt_secret, 
	    {
			expiresIn: '24h',
		}
	);
	
	return resp.cookie('token', token, {
		expires: new Date(Date.now() + expiration),
		secure: false, 
		httpOnly: true,
	});
}

module.exports = router;

