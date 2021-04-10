const Item = require('./model');
const assert = require('assert').strict;

describe('Item model - validation errors', () => {
    it('all fields are required', () => {
        const item = new Item({

        });

        const error = item.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['name'].message, 'Path `name` is required.');
        assert.equal(error.errors['category'].message, 'Path `category` is required.');
        assert.equal(error.errors['price'].message, 'Path `price` is required.');
    });

    it('category is an enum', () => {
        const item = new Item({
            "name": 'digger',
            "category": "transport",
            "price": 0
        });

        const error = item.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['category'].message, 'Types supported: book, electronic');
    });

    it('price should be positive', () => {
        const item = new Item({
            "name": 'The Hobbit',
            "category": "book",
            "price": -1
        });

        const error = item.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['price'].message, 'price needs to be a positive number');
    });
});


