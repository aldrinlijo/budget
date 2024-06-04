const Category = require('../models/category')

const categoriesController = {} 

categoriesController.create = (req, res) => {
    const name = req.body.name
    const user = req.tokenData._id
    const category = new Category({name, user})
    category.save()
        .then((category) => {
            res.json(category)
        })
        .catch((err) => {
            res.json(err)
        })
}

categoriesController.list = (req, res) => {
    const user = req.tokenData._id
    Category.find({user}).populate('user', ['profile', 'email'])
        .then((category) => {
            res.json(category)
        })
        .catch((err) => {
            res.json(err)
        })
}

categoriesController.update = (req, res) => {
    const body = req.body
    const id = req.params.id
    const user = req.tokenData._id
    Category.findOneAndUpdate({id, user}, body, {new:true})
        .then((category) => {
            res.json(category)
        })
        .catch((err) => {
            res.json(err)
        })
}

categoriesController.delete = (req, res) => {
    const id = req.params.id
    const user = req.tokenData._id
    Category.findOneAndDelete({id, user})
        .then((category) => {
            res.json(category)
        })
        .catch((err) => {
            res.json(err)
        })
}
// categoriesController.update = (req, res) => {
//     const id = req.params.id 
//     const userId = req.tokenData._id 
//     const body = req.body
//     const action = req.query.action
//     if(action === 'delete'){
//         Category.findOneAndUpdate({id, userId}, {isdeleted: true}, {new : true})
//             .then((category) => {
//                 res.json(category)
//             })
//             .catch((err) => {
//                 res.json(err)
//             })
//     } else if(action === 'restore') {
//         Category.findOneAndUpdate({id, userId}, {isdeleted: false}, {new:true})
//             .then((category) => {
//                 res.json(category)
//             })
//             .catch((err) => {
//                 res.json(err)
//             })
//     } else if(action === 'edit'){
//         Category.findOneAndUpdate({id, userId}, body, {new: true})
//             .then((category) => {
//                 res.json(category)
//             })
//             .catch((err) => {
//                 res.json(err)
//             })
//     }
// }

module.exports = categoriesController