const Resource = require('../models/resource')
const fetch = require('node-fetch'); 

const resourceController = {}

resourceController.create = (req, res)=>{
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

        var fullname = firstName+lastName;
        var formData ={
            "dia_name"  : fullname,
            "dia_department" :department,
            "dia_role" : role,
            "dia_id":  id
        }

        const dynamicsResponse = fetch('https://orgcd35d258.crm8.dynamics.com/api/data/v9.0/dia_ProductResource', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL29yZ2NkMzVkMjU4LmNybTguZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTIwMzU3MTEtNTY0MC00OGU1LWJkNzEtOGQ1Yzg1ZGU4ODQwLyIsImlhdCI6MTcxNzY3MDc4OCwibmJmIjoxNzE3NjcwNzg4LCJleHAiOjE3MTc2NzQ2ODgsImFpbyI6IkUyTmdZTkQvY3V2NG5waWYzUWNTN0NLYjNaK3JBd0E9IiwiYXBwaWQiOiI1ZjBlZTFlMy1jNDdlLTQ0ZmItYTIzZi1kZDFiNGZiYzdkN2IiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lMjAzNTcxMS01NjQwLTQ4ZTUtYmQ3MS04ZDVjODVkZTg4NDAvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI5YTQzMWRkMy0zMmMwLTRmYzQtYTEyNi1hMTQyYjdjMjBhNzgiLCJyaCI6IjAuQVQ0QUVWY0Q0a0JXNVVpOWNZMWNoZDZJUUFjQUFBQUFBQUFBd0FBQUFBQUFBQUEtQUFBLiIsInN1YiI6IjlhNDMxZGQzLTMyYzAtNGZjNC1hMTI2LWExNDJiN2MyMGE3OCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImUyMDM1NzExLTU2NDAtNDhlNS1iZDcxLThkNWM4NWRlODg0MCIsInV0aSI6ImZqS19MbEJjejBXLVU2N2ZMazRaQUEiLCJ2ZXIiOiIxLjAifQ.MtNa-UjefaX7tvcy3uWyX4K69vB8FB_wSVUrHaoVcFp9gXmmi_HnCNQVZX3Nr7caGQrOE6qY2UDuifa3mC_T0yxvjTyrky59pbTTfGQk2sk-ouvtVXVkWcMZTuX3fCuoRLPnYYFi67zW9wu1ugMXNSLJR526fR2Dylxog_HKbInjfxjRolGO8ZwvgQ1NAndWIrtnPA1eoLICFYQgZby6su3RRXyS6dOIQG6n8m4sujDuLp6aT_VwOyZ6cBFSWpONjZ4qwvuuioHpBiIr6Z5fEJNJiSVnwYjh3i5qgeb8ez_luQhAsDfWjRDLQXPcWRLKKLV2HuBr2ZCE5swJZefwwg', // Replace with your actual access token
                    },
                    body: JSON.stringify(formData),
                });
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