const Resource = require('../models/resource');
const fetch = require('node-fetch');

const resourceController = {};

resourceController.create = async (req, res) => {
    try {
        const { type, id, firstName, lastName, role, department, status } = req.body;
        const user = req.tokenData._id;
        const data = { type, id, firstName, lastName, role, department, user, status };
        
        const resource = new Resource(data);
        const savedResource = await resource.save();

        const populatedResource = await Resource.findOne({ _id: savedResource._id }).populate('resource');
        res.json(populatedResource);

        const fullname = `${firstName} ${lastName}`;
        const formData = {
            "dia_name": fullname,
            "dia_department": department,
            "dia_role": role,
            "dia_id": id
        };

        const response = await fetch('https://orgcd35d258.crm8.dynamics.com/api/data/v9.0/dia_ProductResource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL29yZ2NkMzVkMjU4LmNybTguZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTIwMzU3MTEtNTY0MC00OGU1LWJkNzEtOGQ1Yzg1ZGU4ODQwLyIsImlhdCI6MTcxNzczMjIyNCwibmJmIjoxNzE3NzMyMjI0LCJleHAiOjE3MTc3MzYxMjQsImFpbyI6IkUyTmdZQkRyREgvdG5Ubm54czJua1VmbVBIOGREUUE9IiwiYXBwaWQiOiI1ZjBlZTFlMy1jNDdlLTQ0ZmItYTIzZi1kZDFiNGZiYzdkN2IiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lMjAzNTcxMS01NjQwLTQ4ZTUtYmQ3MS04ZDVjODVkZTg4NDAvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI5YTQzMWRkMy0zMmMwLTRmYzQtYTEyNi1hMTQyYjdjMjBhNzgiLCJyaCI6IjAuQVQ0QUVWY0Q0a0JXNVVpOWNZMWNoZDZJUUFjQUFBQUFBQUFBd0FBQUFBQUFBQUEtQUFBLiIsInN1YiI6IjlhNDMxZGQzLTMyYzAtNGZjNC1hMTI2LWExNDJiN2MyMGE3OCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImUyMDM1NzExLTU2NDAtNDhlNS1iZDcxLThkNWM4NWRlODg0MCIsInV0aSI6ImFIYTE5TzVUb2tDV1NjdVZhM1VLQUEiLCJ2ZXIiOiIxLjAifQ.hYknqXYOzgUUQ2xZt_XFLIRLWZ1mAttG7LBGlY2EmALoh0-POmqzTxWLowYCPnwX5AOBenvRINXySAIx2XxgPB6HpNw0Pqvk9Ln9Sw4j6qhst-Pm8cnSrOmWCSSJlxRN6Zcac_R6weX_cfR18UKK9pcQHvbOh8mbY2xZIg8KJv0p4F9x2Mry53DGkyt1iQJcUAPPpZC8DLC-2tUSsKyEq5khfOMfkaD3IPTVFLWhoDYMDLApKx4CTJ2OD1uTp6D4UtqfUjTjHeAJUrPS07FWy8hajvviIdEQQ_lCcz0omDkKIQP_aVl4tG4fn0l8AjLuN2LN77H8zDwyMGvJPgVpRg', // Replace 'YOUR_ACCESS_TOKEN' with your actual token
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            console.error('Error creating resource in Dynamics 365:', response.statusText);
        }

    } catch (err) {
        res.json(err);
    }
};

resourceController.list = async (req, res) => {
    try {
        const user = req.tokenData._id;
        const resources = await Resource.find({ user }).populate('resource', ['name']);
        res.json(resources);
    } catch (err) {
        res.json(err);
    }
};

resourceController.update = async (req, res) => {
    try {
        const body = req.body;
        const id = req.params.id;
        const user = req.tokenData._id;
        const updatedResource = await Resource.findOneAndUpdate({ id, user }, body, { new: true });
        res.json(updatedResource);
    } catch (err) {
        res.json(err);
    }
};

resourceController.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.tokenData._id;
        const deletedResource = await Resource.findOneAndDelete({ id, user });
        res.json(deletedResource);
    } catch (err) {
        res.json(err);
    }
};

module.exports = resourceController;
