const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true, index: true, dropDups: true },
	password: { type: String, required: true },
	userType: { type: String, required: true, default: 'client' },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;