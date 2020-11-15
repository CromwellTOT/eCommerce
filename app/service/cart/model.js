const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    qty: { type: Number, required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true, },
},);

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [ cartItemSchema ],
});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;