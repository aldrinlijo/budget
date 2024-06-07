const axios = require('axios');
const Resource = require('../models/resource');

const resourceController = {};

resourceController.create = async (req, res) => {
    try {
        const { type, id, firstName, lastName, role, department, status } = req.body;
        const user = req.tokenData._id;
        const data = { type, id, firstName, lastName, role, department, user, status };
        
        const resource = new Resource(data);
        const savedResource = await resource.save();

        const populatedResource = await Resource.findOne({ _id: savedResource._id }).populate(resource);
        res.json(populatedResource);

        const fullname = `${firstName} ${lastName}`;
        const formData = {
            "dia_name": fullname,
            "dia_department": department,
            "dia_role": role,
            "dia_id": id
        };

        const response = await axios.post(
            'https://orgcd35d258.crm8.dynamics.com/api/data/v9.0/dia_productresource',
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL29yZ2NkMzVkMjU4LmNybTguZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTIwMzU3MTEtNTY0MC00OGU1LWJkNzEtOGQ1Yzg1ZGU4ODQwLyIsImlhdCI6MTcxNzc2MzU3NywibmJmIjoxNzE3NzYzNTc3LCJleHAiOjE3MTc3Njc0NzcsImFpbyI6IkUyTmdZUGh2V2VIOXc3ak9OYWo0cjNqZmw2bDdBUT09IiwiYXBwaWQiOiI1ZjBlZTFlMy1jNDdlLTQ0ZmItYTIzZi1kZDFiNGZiYzdkN2IiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lMjAzNTcxMS01NjQwLTQ4ZTUtYmQ3MS04ZDVjODVkZTg4NDAvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI5YTQzMWRkMy0zMmMwLTRmYzQtYTEyNi1hMTQyYjdjMjBhNzgiLCJyaCI6IjAuQVQ0QUVWY0Q0a0JXNVVpOWNZMWNoZDZJUUFjQUFBQUFBQUFBd0FBQUFBQUFBQUEtQUFBLiIsInN1YiI6IjlhNDMxZGQzLTMyYzAtNGZjNC1hMTI2LWExNDJiN2MyMGE3OCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImUyMDM1NzExLTU2NDAtNDhlNS1iZDcxLThkNWM4NWRlODg0MCIsInV0aSI6InREX3RjZGk3YTBXN3hjQWZEc0VuQUEiLCJ2ZXIiOiIxLjAifQ.SvqrwkUn9Pm-h69MBz4srOBvDEn6ITCCDSvFj_s7eB0jLgsz0_yQ3zEAlK0Um1-_sAZz9Xh53h2P23SRiw_RaMG8fMM705aSh16Txiy8mwRcCWqN8ZWWlbj1Wqj-YnP-IgKkRfJXW7X98pYp0MMEauusBnfh4LH0g_LxG8d9Ad3ZKusH38pTyrNzbJsZ7isHhiRpGh7Bs33z0MxW-H8E2EToBSI_QZipldGdynou_DvNPTv0hU21C979vRh6X_ya7ATe6w8a-GwT5kEGKd3zwznFTixm1ajHr1HdSXcFpEKh1rP-o5z7pgoaAg6Mi0oIkyVEd3Wypcuw1bwRufc-8Q' // Replace 'YOUR_ACCESS_TOKEN' with your actual token
                }
            }
        );

        if (response.status !== 201) { // Adjust status check based on Dynamics 365 API documentation
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
