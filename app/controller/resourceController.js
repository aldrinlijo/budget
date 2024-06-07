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

        const populatedResource = await Resource.findOne({ _id: savedResource._id }).populate('resource');
        res.json(populatedResource);

        const fullname = `${firstName} ${lastName}`;
        const formData = {
            "dia_name": fullname,
            "dia_department": department,
            "dia_role": role,
            "dia_id": id
        };

        const resourceId = '6799792d-cd24-ef11-840a-002248d61d46'; // Replace with your actual resource ID
        const response = await axios.patch(
            `https://orgcd35d258.crm8.dynamics.com/api/data/v9.0/dia_productresource(${resourceId})`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL29yZ2NkMzVkMjU4LmNybTguZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTIwMzU3MTEtNTY0MC00OGU1LWJkNzEtOGQ1Yzg1ZGU4ODQwLyIsImlhdCI6MTcxNzc2NTYyNiwibmJmIjoxNzE3NzY1NjI2LCJleHAiOjE3MTc3Njk1MjYsImFpbyI6IkUyTmdZT2pNczUveTlraGtrT3VTNTQxUlNVSzVBQT09IiwiYXBwaWQiOiI1ZjBlZTFlMy1jNDdlLTQ0ZmItYTIzZi1kZDFiNGZiYzdkN2IiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lMjAzNTcxMS01NjQwLTQ4ZTUtYmQ3MS04ZDVjODVkZTg4NDAvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI5YTQzMWRkMy0zMmMwLTRmYzQtYTEyNi1hMTQyYjdjMjBhNzgiLCJyaCI6IjAuQVQ0QUVWY0Q0a0JXNVVpOWNZMWNoZDZJUUFjQUFBQUFBQUFBd0FBQUFBQUFBQUEtQUFBLiIsInN1YiI6IjlhNDMxZGQzLTMyYzAtNGZjNC1hMTI2LWExNDJiN2MyMGE3OCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImUyMDM1NzExLTU2NDAtNDhlNS1iZDcxLThkNWM4NWRlODg0MCIsInV0aSI6Ii1UMjBlRi1PVlUyOVFmQ05qRlVXQUEiLCJ2ZXIiOiIxLjAifQ.UMA3Sl8kGcyIFtte17uv7F7kgcDP61RCb3dddk_c5vWMUDXyLlkLOibJg-C0JG-M9BqViOJl3yoRNFpGdbvNXnODIBYrxFmG4hAJRRaGlPcCwASwOjrIEqEz__bVE0DIRFIXXf8HbGLmm1TKrBwJIrwozKjW13QgA2G_s-0qr4vHtarZz5r0q5ZWL6_g-UYWuPNY1-pPH7WDKsoi9QhRxPWz8ijWrraXzfWvSjz7iZ1vMlqTQdvVOiqYCWQvB6SFWVHL0e19RVp62FivqQavvE86B-ERoAxoebWfzPyZcFcadvWrUHh_fXpin-u9XPxAyvl9-wuhontAYYETma1c3g' // Replace 'YOUR_ACCESS_TOKEN' with your actual token
                }
            }
        );

        if (response.status !== 204) { // Adjust status check based on Dynamics 365 API documentation
            console.error('Error updating resource in Dynamics 365:', response.statusText);
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

resourceController.list = async (req, res) => {
    try {
        const user = req.tokenData._id;
        const resources = await Resource.find({ user }).populate('resource', ['name']);
        res.json(resources);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        res.status(500).json({ error: err.message });
    }
};

resourceController.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.tokenData._id;
        const deletedResource = await Resource.findOneAndDelete({ id, user });
        res.json(deletedResource);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = resourceController;
