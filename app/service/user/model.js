const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		index: true,
		dropDups: true,
		validate: {
			validator: (email) => {
				const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				return emailRegex.test(email); // Assuming email has a text attribute
			},
			message: 'Email in wrong format'
		}
	},
	password: {
		type: String,
		required: true
	},
	userType: {
		type: String,
		required: true,
		default: 'client'
	},
});

userSchema.pre('save', (next) => {
	const self = this;

	mongoose.models['role'].findOne({userType: self.userType}, (err, role) => {
		if (role) {
			next();
		} else {
			next(new Error(`userType ${userType} does not exists, please create first`));
		}
	});
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;