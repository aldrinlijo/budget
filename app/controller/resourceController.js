const Expense = require('../models/resourse')

const expensesController = {}

expensesController.create =(req, res) => {
    const {type, id, firstName, lastName, role, department, status} = req.body
    const user = req.tokenData._id
    const data = {type, id, firstName, lastName, role, department, status}
    const expense = new Expense(data)
    resource.save()
        .then((expense) => {
            Expense.findOne({_id: resource._id}).populate('resource', ['name'])
                .then((expense) => {
                    res.json(expense)
                })
        })
        .catch((err) => {
            res.json(err)
        })
}

expensesController.list = (req, res) => {
    const user = req.tokenData._id
    Expense.find({user}).populate('resource', ['name'])
        .then((expense) => {
            res.json(expense)
        })
        .catch((err) => {
            res.json(err)
        })
}

expensesController.update = (req, res) => {
    const body = req.body
    const id = req.params.id
    const user = req.tokenData._id
    Expense.findOneAndUpdate({id, user}, body, {new : true})
        .then((expense) => {
            res.json(expense)
        })
        .catch((err) => {
            res.json(err)
        })
}

expensesController.delete = (req, res) => {
    const id = req.params.id
    const user = req.tokenData._id
    Expense.findOneAndDelete({id, user})
        .then((expense) => {
            res.json(expense)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = expensesController