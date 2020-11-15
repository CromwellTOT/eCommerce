const express = require("express");
const router = express.Router();

const Cart = require('./model');
const isAuthorized = require('../../access-control/authorize');

const ObjectId = require('mongoose').Types.ObjectId; 

// get your own cart details
router.get("/", isAuthorized, async (req, resp) => {
	let cart; 
	try {
		cart = await Cart.findOne({user: new ObjectId(req.user.id)}).populate("items.item");
	} catch (e) {
		return resp.status(500).send({ error_message: 'Internal Error - please contact customer support' });
	}
	
	if (!cart) {
		return resp.status(404).send({ error_message: 'Cart Not Found' });
	}

	resp.send({ items: cart.items });
});

// update your own cart
router.post("/", isAuthorized, async (req, resp) => {
	// @todo: validation
	
	try {
		let cart = await Cart.findOne({user: new ObjectId(req.user.id)});

		if (!cart) {
			// create new cart 
			cart = new Cart({
				user: req.user.id,
				items: req.body.items,
			});

			cart = await cart.save();
		} else {
			// update existing cart
			cart.items = req.body.items

			cart = await cart.save();
		}

		return resp.status(200).send({ message: "Cart Updated" });
	} catch (e) {
		return resp.status(500).send({ error_message: 'Internal Error - please contact customer support' });
	}
});

module.exports = router;