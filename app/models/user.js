const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        validate : {
            validator : function(value){
                return isEmail(value)
            }, 
            message : function(){
                return 'invalid email'
            }
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
        maxlength : 128
    },
    profile : {
        name : {
            type : String,
            required : true
        },
        occupation : {
            type : String
        }
    }
}, {timestamps : true})

userSchema.pre('save', function(next){
    const user = this 
    bcrypt.genSalt()
        .then((salt) => {
            bcrypt.hash(user.password, salt)
                .then((encrypted) => {
                    user.password = encrypted
                    next()
                })
        })
})

const User = mongoose.model('User', userSchema)

module.exports = User