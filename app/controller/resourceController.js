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
                        'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL29yZ2NkMzVkMjU4LmNybTguZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTIwMzU3MTEtNTY0MC00OGU1LWJkNzEtOGQ1Yzg1ZGU4ODQwLyIsImlhdCI6MTcxNzY3NDg4MCwibmJmIjoxNzE3Njc0ODgwLCJleHAiOjE3MTc2Nzg3ODAsImFpbyI6IkUyTmdZUGl6ZFZmN1ZidXlhU0ZjbGV0MDgxNnZCUUE9IiwiYXBwaWQiOiI1ZjBlZTFlMy1jNDdlLTQ0ZmItYTIzZi1kZDFiNGZiYzdkN2IiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lMjAzNTcxMS01NjQwLTQ4ZTUtYmQ3MS04ZDVjODVkZTg4NDAvIiwib2lkIjoiOWE0MzFkZDMtMzJjMC00ZmM0LWExMjYtYTE0MmI3YzIwYTc4IiwicmgiOiIwLkFUNEFFVmNENGtCVzVVaTljWTFjaGQ2SVFBY0FBQUFBQUFBQXdBQUFBQUFBQUFBLUFBQS4iLCJzdWIiOiI5YTQzMWRkMy0zMmMwLTRmYzQtYTEyNi1hMTQyYjdjMjBhNzgiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiJlMjAzNTcxMS01NjQwLTQ4ZTUtYmQ3MS04ZDVjODVkZTg4NDAiLCJ1dGkiOiJaR3l5M1hGa2NVS01NVUQ3Wk14M0FBIiwidmVyIjoiMS4wIn0.oUNXWQWhUkLJk-LAkCUQ2OlkFArjDPf2WUBh-ivAtSN-EvOYWhcbiOpzARyw3PqfoWJPDYNCO-e1P-QHHlK3H-ozwnXhNKUTyjMd05C5jp3K6op5wbATZbxbAELQtsvNpWh6Vsa11OTEBAQ2q1xxo5O5Ykly1dB1znmXP-Lz0Vi3WRlWEeoa8UgRo4YYVYvykotXid81YkYxw87UUO9UF3QcGpGEEI2XUtx423y5c8wtndmn-Wra_5lHQg82fNRbSAYirp3IFPCbnL51Uwfjigz52D16DjdiNHldEKRdrUqOKZYPH4d1VoE40feiUrcv0MKDelev2kat0TSqrAXd7A',
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