const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true
    },
    accessPath: {
        type: String,
        required: true
    },
    access: {
        type: Boolean,
        required: true,
    },
});

const roleModel = mongoose.model('Role', roleSchema);

module.exports = roleModel;
