const express = require("express");
const router = express.Router();
const User = require('./model');

// get user info by id
router.get("/:id", async (req, resp) => {

});

// create new user
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
router.put("/:id", async (req, resp) => {
	var data = req.body;
});

module.exports = router;