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
    user : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true
    }
});

const Resource = mongoose.model('Resource', resourceDetailsSchema)
module.exports = Resource
