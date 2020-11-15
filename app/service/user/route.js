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
		return resp.status(500).send({ message: 'Internal Error - please contact customer support' });
	}

	if (!user) {
		return resp.status(404).send({ message: 'User Not Found' });
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
		resp.send({
			_id: newUser.id,
			name: newUser.name,
			email: newUser.email,
		});
	} else {
		resp.status(401).send({ error_message: 'Invalid User Data.' });
	}
});

// update user info by id
router.put("/:id", isAuthorized, async (req, resp) => {
	// admin can update any user, normal user can only update themself
	if (req.user.id !== req.params.id && req.user.userType !== 'admin') {
		return resp.status(403).send({ error_message: `Authorization failed - not allowed to update user` , });
	}

	let user;
	try {
		user = await User.findById(req.params.id);
	} catch (e) {
		return resp.status(500).send({ message: 'Internal Error - please contact customer support' });
	}

	if (!user) {
		return resp.status(404).send({ message: 'User Not Found' });
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






