const Cart = require('./model');
const assert = require('assert').strict;

describe('Cart model', () => {
    it('user field is required', () => {
        const cart = new Cart({
        });

        const error = cart.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['user'].message, 'Path `user` is required.');
    });

    it('item and qty fields are required', () => {
        const cart = new Cart({
            user: '5fa7874a536f7aa61c4d8881',
            items: [
                {

                }
            ]
        });

        const error = cart.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['items.0.item'].message, 'Path `item` is required.');
        assert.equal(error.errors['items.0.qty'].message, 'Path `qty` is required.');
    });

    it('qty has to be a positive number', () => {
        const cart = new Cart({
            user: '5fa7874a536f7aa61c4d8881',
            items: [
                {
                    "qty": -1,
                    "item": '6071160ae1aa692cf96e4ba5',
                }
            ]
        });

        const error = cart.validateSync();

        assert.ok(error, 'at least one validation error should be thrown');
        assert.equal(error.errors['items.0.qty'].message, 'Quantity needs to be a positive number');
    });

    it('valid input', () => {
        const cart = new Cart({
            user: '5fa7874a536f7aa61c4d8881',
            items: [
                {
                    "qty": 2,
                    "item": '6071160ae1aa692cf96e4ba5',
                }
            ]
        });

        const error = cart.validateSync();

        assert.ok(!error, 'no validation error should be thrown');
    });
});


