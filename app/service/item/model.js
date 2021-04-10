const mongoose = require('mongoose');

const category_enum = ['book', 'electronic'];

const itemSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		validate: {
			validator: (category) => category_enum.includes(category),
			message: `Types supported: ${category_enum.join(', ')}`
		},
		required: true },
	price: {
		type: Number,
		required: true,
		min: [0, 'price needs to be a positive number']
	},
});

const itemModel = mongoose.model('Item', itemSchema);

module.exports = itemModel;
