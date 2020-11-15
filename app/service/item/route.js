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

	if (!item) {
		return resp.status(404).send({ error_message: 'Item Not Found.' });
	}

	return resp.send(item);
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
		return resp.status(500).send({ error_message: 'Error in Creating Item.' });
	}

	if (!newItem) {
		return resp.status(500).send({ error_message: 'Error in Creating Item.' });
		
	}

	return resp.status(201).send({ data: newItem });
});

router.put('/:id', isAuthorized, async (req, resp) => {
	try {
		const item = await Item.findById(req.params.id);
	
		// todo: validation

		if (item) {
			item.name = req.body.name;
			item.category = req.body.category;
			item.price = req.body.price;

			const updatedItem = await item.save();

			if (!updatedItem) {
				return resp.status(500).send({ error_message: 'Error in Updating Item.' });
			}

			return resp.send({ data: updatedItem });
		}
	} catch (e) {
		return resp.status(500).send({ error_message: 'Error in Updating Item.' });
	}
});

router.delete('/:id', isAuthorized, async (req, resp) => {
	try {
		const deletedItem = await Item.findById(req.params.id);

		if (!deletedItem) {
			return resp.status(500).send({ error_message: 'Error in Deleting Item.' });
		}

		await deletedItem.remove();
    	return resp.send({ message: 'Item Deleted' });
	} catch (e) {
		return resp.status(500).send({ error_message: 'Error in Deleting Item.' });
	}
});

module.exports = router;







