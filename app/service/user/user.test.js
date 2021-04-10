const User = require('./model');
const assert = require('assert').strict;

describe('User model - validation errors', () => {
    it('all fields are required', () => {
        const user = new User({
        });

        const error = item.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['name'].message, 'Path `name` is required.');
        assert.equal(error.errors['email'].message, 'Path `email` is required.');
        assert.equal(error.errors['password'].message, 'Path `password` is required.');
        assert.equal(error.errors['userType'].message, 'Path `userType` is required.');
    });

    it('email is in correct format', () => {
        const user = new User({
            "name": 'frankzhang',
            "email": "transport",
            "password": 0,
            "userType": 'client',
        });

        const error = item.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['category'].message, 'Types supported: book, electronic');
    });
});


