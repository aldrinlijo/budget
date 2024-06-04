const Budget = require('../models/budget')

const budgetController = {}

budgetController.update = (req, res) => {
    const id = req.params.id
    const user = req.tokenData._id
    const body = req.body
    const amount = body.amount
    Budget.findOneAndUpdate({id, user}, body, {new:true})
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