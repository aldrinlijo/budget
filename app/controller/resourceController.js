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
                        'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL29yZ2NkMzVkMjU4LmNybTguZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTIwMzU3MTEtNTY0MC00OGU1LWJkNzEtOGQ1Yzg1ZGU4ODQwLyIsImlhdCI6MTcxNzY4MTQ0MiwibmJmIjoxNzE3NjgxNDQyLCJleHAiOjE3MTc2ODUzNDIsImFpbyI6IkUyTmdZTmkyekh2bmlhWW44NmYvY1hmMFA1V2hDZ0E9IiwiYXBwaWQiOiI1ZjBlZTFlMy1jNDdlLTQ0ZmItYTIzZi1kZDFiNGZiYzdkN2IiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lMjAzNTcxMS01NjQwLTQ4ZTUtYmQ3MS04ZDVjODVkZTg4NDAvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI5YTQzMWRkMy0zMmMwLTRmYzQtYTEyNi1hMTQyYjdjMjBhNzgiLCJyaCI6IjAuQVQ0QUVWY0Q0a0JXNVVpOWNZMWNoZDZJUUFjQUFBQUFBQUFBd0FBQUFBQUFBQUEtQUFBLiIsInN1YiI6IjlhNDMxZGQzLTMyYzAtNGZjNC1hMTI2LWExNDJiN2MyMGE3OCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImUyMDM1NzExLTU2NDAtNDhlNS1iZDcxLThkNWM4NWRlODg0MCIsInV0aSI6ImV6YmhkYUZkZ2tPUnVoSVl0a29hQUEiLCJ2ZXIiOiIxLjAifQ.Jc8uRMJ4pR7DwNKS6bGoQnuSOSrRh5Br-fJ0DYK7whyCxUk0oysS4gsaqCZOsDPuEExZCqHrxJskBk8bHWQQR0g-UGdOrKmwV1xH6A2Zqza4VAlC84qRs-bCvtcO02BEmPlVfCfLSVBGY62GHaRthKIO0TlrnK-MnZ6G2zosEgc2KVekxeJEw2Vtq69epd61ZSNI76k0Z80tFXFO7Xt9Ze9zczaFJ0h4uFwB2qXTpydZkOiGyI50rKkwdvA5hLFFXGSAZxT7_lJTRPpLVetNqR8BR5_ls3Io4cS3z3gvAo-hYIF6D577JPl_sSesgQLWeSlcNRK5cJbprnqG0Rk44A',
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