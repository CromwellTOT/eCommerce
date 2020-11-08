const express = require("express");
const Item = require('./model');
const isAuthorized = require('../../access-control/authorize');

const router = express.Router();

// get all items
router.get('/', async (req, resp) => {
	resp.json(); 
});

// create a new item
router.post('/', isAuthorized, async (req, resp) => {
	const item = new Item({
		name: req.body.name,
		 category: req.body.category,
		 price: req.body.price,
	})
});

module.exports = router;