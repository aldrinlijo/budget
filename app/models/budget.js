const mongoose = require('mongoose')

const Schema = mongoose.Schema 

const budgetSchema = new Schema({
    amount : {
        type : Number,
        required : true,
        default : 0
    },
    amtTest :{
        type : Number,
        default : 0
    },
    user : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    }
})

const Budget = mongoose.model('Budget', budgetSchema)
module.exports = Budget