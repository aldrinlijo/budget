const Expense = require('../models/expense')
const Budget = require('../models/budget')

const expensesController = {}

expensesController.create =(req, res) => {
    const {title, amount, expenseDate, category} = req.body
    const user = req.tokenData._id
    // const budget = Budget.findOne({user}).amount
    // const  newamount = budget - amount
    // const add  = {
    //     amount : newamount,
    // }
    // const newbudget = new Budget(add)
    const data = {title, amount, expenseDate, category, user}
    const expense = new Expense(data)

    //newbudget.save()


    expense.save()
        .then((expense) => {
            Expense.findOne({_id: expense._id}).populate('category', ['name'])
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
    Expense.find({user}).populate('category', ['name'])
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