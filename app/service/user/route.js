const express = require("express");
const router = express.Router();

const User = require('./model');
const isAuthorized = require('../../access-control/authorize');


// get user info by id
router.get("/:id", isAuthorized, async (req, resp) => {
	let user;
	try {
		user = await User.findById(req.params.id);
	} catch (e) {
		return resp.status(500).send({ error_message: 'Internal Error - please contact customer support' });
	}

	if (!user) {
		return resp.status(404).send({ error_message: 'User Not Found' });
	}

	resp.send({
		_id: user.id,
		name: user.name,
		email: user.email,
		userType: user.userType,
    });
});

// registration
router.post("/", async (req, resp) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	});
	
	const newUser = await user.save();

	if (newUser) {
		resp.status(201).send({
			_id: newUser.id,
			name: newUser.name,
			email: newUser.email,
		});
	} else {
		resp.status(401).send({ error_message: 'Invalid User Data.' });
	}
});

// only update your own user info is allowed 
router.put("/", isAuthorized, async (req, resp) => {
	let user;
	try {
		user = await User.findById(req.user.id);
	} catch (e) {
		return resp.status(500).send({ error_message: 'Internal Error - please contact customer support' });
	}

	if (!user) {
		return resp.status(404).send({ error_message: 'User Not Found' });
	}

	user.name = req.body.name || user.name;
	user.email = req.body.email || user.email;
	user.password = req.body.password || user.password;

	const updatedUser = await user.save();	

	resp.send({
		_id: updatedUser.id,
		name: updatedUser.name,
		email: updatedUser.email,
		userType: updatedUser.userType,
    });
});

module.exports = router;






