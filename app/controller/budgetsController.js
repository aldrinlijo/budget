const Budget = require('../models/budget')

const budgetController = {}

budgetController.update = (req, res) => {
    const id = req.params.id
    const user = req.tokenData._id
    const body = req.body
    const add  = body + 10000
    Budget.findOneAndUpdate({id, user}, add, {new:true})
        .then((budget) => {
            res.json(budget)
        })
        .catch((err) => {
            res.json(err)
        })
}

budgetController.list = (req, res) =>{
    const user = req.tokenData._id
    Budget.findOne({user : user}).populate('user', ['profile', 'email'])
        .then((budget) => {
            res.json(budget)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = budgetController