const Resource = require('../models/resource')

const resourceController = {}

resourceController.create =(req, res) => {
    const {type, id, firstName, lastName, role, department, status} = req.body
    const user = req.tokenData._id
    const data = {type, id, firstName, lastName, role, department,user, status}
    const resource = new Resource(data)
    resource.save()
        .then((resource) => {
            Resource.findOne({_id: resource._id}).populate('resource', ['name'])
                .then((resource) => {
                    res.json(resource)
                })
        })
        .catch((err) => {
            res.json(err)
        })
}

resourceController.list = (req, res) => {
    const user = req.tokenData._id
    Resource.find({user}).populate('resource', ['name'])
        .then((resource) => {
            res.json(resource)
        })
        .catch((err) => {
            res.json(err)
        })
}

resourceController.update = (req, res) => {
    const body = req.body
    const id = req.params.id
    const user = req.tokenData._id
    Resource.findOneAndUpdate({id, user}, body, {new : true})
        .then((resource) => {
            res.json(resource)
        })
        .catch((err) => {
            res.json(err)
        })
}

resourceController.delete = (req, res) => {
    const id = req.params.id
    const user = req.tokenData._id
    Resource.findOneAndDelete({id, user})
        .then((resource) => {
            res.json(resource)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = resourceController