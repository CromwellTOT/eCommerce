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

    resp.send(items);
});

// get one by id
router.get('/:id', async (req, resp) => {
	const item = await Item.findOne({ _id: req.params.id });

	if (!item) {
		return resp.status(404).send({ error_message: 'Item Not Found.' });
	}

	resp.send(item);
});

// create a new item
router.post('/', isAuthorized, async (req, resp) => {
	const item = new Item({
		name: req.body.name,
		category: req.body.category,
		price: req.body.price,
	});

	let newItem;
	try {
		newItem = await item.save();
	} catch (e) {
		return resp.status(400).send({
			error_message: 'Error in Creating Item.',
			debug_info: e.errors,
		});
	}

	if (!newItem) {
		return resp.status(500).send({ error_message: 'Error in Creating Item.' });
	}

	resp.status(201).send({ data: newItem });
});

router.put('/:id', isAuthorized, async (req, resp) => {
	const item = await Item.findById(req.params.id);

	if (!item) {
		return resp.status(404).send({ error_message: 'Item not found' });
	}

	item.name = req.body.name;
	item.category = req.body.category;
	item.price = req.body.price;

	let updatedItem;

	try {
		updatedItem = await item.save();
	} catch (e) {
		return resp.status(400).send({
			error_message: 'Error in Updating Item.',
			debug_info: e.errors,
		});
	}

	if (!updatedItem) {
		return resp.status(500).send({ error_message: 'Error in Updating Item.' });
	}

	resp.send({ data: updatedItem });
});

router.delete('/:id', isAuthorized, async (req, resp) => {
	try {
		const deletedItem = await Item.findById(req.params.id);

		if (!deletedItem) {
			return resp.status(404).send({ error_message: 'Item not found' });
		}

		await deletedItem.remove();

    	resp.send({ message: 'Item Deleted' });
	} catch (e) {
		resp.status(400).send({ error_message: 'Error in Deleting Item.' });
	}
});

module.exports = router;







