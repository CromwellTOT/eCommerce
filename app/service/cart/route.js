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
	let cart = await Cart.findOne({user: new ObjectId(req.user.id)});

	if (!cart) {
		// create new cart
		cart = new Cart({
			user: req.user.id,
			items: req.body.items,
		});

		cart = await updateCart(cart);
	} else {
		// update existing cart
		cart.items = req.body.items

		cart = await updateCart(cart);
	}

	if (cart) {
		resp.send({ message: "Cart Updated" });
	}

	async function updateCart(cart) {
		try {
			return await cart.save();
		} catch (e) {
			resp.status(400).send({
				error_message: 'Error in Creating Role.',
				debug_info: e.errors,
			});
		}
	}
});

module.exports = router;