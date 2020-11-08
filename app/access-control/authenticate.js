const express = require("express");
const User = require('../service/user/model');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/", async (req, resp) => {
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

function generateTokenAndStoreInCookie(res, user) {
	const expiration = 604800000;

	const token = jwt.sign({
			_id: user._id,
			name: user.name,
			email: user.email,
			userType: user.userType
	    }, 
	    'tobestoredinconfigfileinsteadofhere!!!', 
	    {
			expiresIn: '48h',
		}
	);
	
	return res.cookie('token', token, {
		expires: new Date(Date.now() + expiration),
		secure: false, 
		httpOnly: true,
	});
}

module.exports = router;

