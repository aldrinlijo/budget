const express = require('express')
const router = express.Router()

const usersController = require('../app/controller/usersController')
const categoriesController = require('../app/controller/categoriesController')
const expensesController = require('../app/controller/expensesController')
const budgetController = require('../app/controller/budgetsController')
const {authenticateUser} = require('../app/middleware/authenctication')

router.post('/api/user/register', usersController.register)
router.post('/api/user/login', usersController.login)
router.get('/api/user/account', authenticateUser, usersController.account)

router.post('/api/category', authenticateUser, categoriesController.create)
router.get('/api/category', authenticateUser, categoriesController.list)
router.put('/api/category', authenticateUser, categoriesController.update)
router.delete('/api/category', authenticateUser, categoriesController.delete)

router.post('/api/expense', authenticateUser, expensesController.create)
router.get('/api/expense', authenticateUser, expensesController.list)
router.put('/api/expense', authenticateUser, expensesController.update)
router.delete('/api/expense', authenticateUser, expensesController.delete)


router.put('/api/budget/update', authenticateUser, budgetController.update)
router.get('/api/budget/list', authenticateUser, budgetController.list)



module.exports = router