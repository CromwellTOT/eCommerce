const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
	name: { type: String, required: true },
	category: { type: String, required: true },
	price: { type: Number, required: true },
});

const itemModel = mongoose.model('Item', itemSchema);

module.exports = itemModel;