const User = require('./model');
const assert = require('assert').strict;

describe('User model', () => {
    it('all fields are required', () => {
        const user = new User({
        });

        const error = user.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['name'].message, 'Path `name` is required.');
        assert.equal(error.errors['email'].message, 'Path `email` is required.');
        assert.equal(error.errors['password'].message, 'Path `password` is required.');
    });

    it('email is in correct format', () => {
        const user = new User({
            "name": 'frankzhang',
            "email": 'frank@com',
            "password": 'secret',
            "userType": 'client',
        });

        const error = user.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['email'].message, 'Email in wrong format');
    });

    it('valid input', () => {
        const user = new User({
            "name": 'frankzhang',
            "email": 'frankzhang@gmail.com',
            "password": 'secret',
            "userType": 'client',
        });

        const error = user.validateSync();

        assert.ok(!error, 'no validation error should be thrown');
    });
});


