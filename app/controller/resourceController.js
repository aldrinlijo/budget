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
                'Authorization': 'Bearer ' + 'YOUR_ACCESS_TOKEN', // Replace 'YOUR_ACCESS_TOKEN' with your actual token
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
