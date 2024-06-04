const User = require('../models/user')
const Budget = require('../models/budget')
const {pick} = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const usersController = {}

usersController.register = (req, res) => {
    const body = req.body
    const data = pick(body, ['email', 'password', 'profile']) 
    const user = new User(data)
    user.save()
        .then((user) => {
            const budget = new Budget({user : user._id})
            budget.save()
                .then((data)=>{
                    res.json('Successfully Registered')
                })
                .catch((error)=>{
                    res.json({error})
                })
        })
        .catch((error) => {
            res.json({error})
        })
}

usersController.login = (req, res) => {
    const {email, password} = req.body
    User.findOne({email : email})
        .then((user) => {
            if(user){
                bcrypt.compare(password, user.password)
                    .then((result) => {
                        if(result){
                            const tokenData = {_id : user._id, name : user.profile.name, email : user.email}
                            const token = jwt.sign(tokenData, process.env.JWT_SECRET)
                            res.json({token : `Bearer ${token}`})
                        } else {
                            res.json({notice : 'invalid email or password'})
                        }
                    })
            } else {
                res.json({notice : 'invalid email or password'})
            }
        })
        .catch((error) => {
            res.json({error})
        })
}

usersController.account  = (req, res) => {
    const tokenData = req.tokenData
    User.findOne({_id : tokenData._id})
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = usersController