const express = require("express");
const router = express.Router();

const Item = require('./model');
const isAuthorized = require('../../access-control/authorize');

// get all items
router.get('/', async (req, resp) => {
	// support ?category=xxx query param
	const category = req.query.category ? { category: req.query.category } : {};
	// support ?search=xxx query param
	const search = req.query.search ? {
		name: {
			$regex: req.query.search,
			$options: 'i',
		},
	} : {};

    const items = await Item.find({ ...category, ...search });

    return resp.send(items);
});

// get one by id
router.get('/:id', async (req, resp) => {
	const item = await Item.findOne({ _id: req.params.id });

	if (item) {
		return resp.send(item);
	} else {
		return resp.status(404).send({ error_message: 'Item Not Found.' });
	}
});

// create a new item
router.post('/', isAuthorized, async (req, resp) => {
	const item = new Item({
		name: req.body.name,
		category: req.body.category,
		price: req.body.price,
	});

	const newItem = await item.save();

	if (newItem) {
		return resp.status(201).send({ message: 'New Item Created', data: newItem });
	} else {
		return resp.status(500).send({ message: ' Error in Creating Item.' });
	}
});

module.exports = router;