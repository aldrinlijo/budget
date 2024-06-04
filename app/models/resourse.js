const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceDetailsSchema = new Schema({
    type: {
        type: String,
        enum: ['employee', 'contractor'],
        required: true
    },
    id: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true
    }
});

module.exports = mongoose.model('ResourceDetails', resourceDetailsSchema);
