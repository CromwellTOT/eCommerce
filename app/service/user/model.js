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

userSchema.pre('save', function (next) {
	const self = this;

	mongoose.models['Role'].findOne({userType: self.userType}, (err, role) => {
		if (role) {
			next();
		} else {
			next({
				errors: `userType ${self.userType} does not exists, please create first`
			});
		}
	});
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;