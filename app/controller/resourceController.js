const axios = require('axios');
const Resource = require('../models/resource');

const resourceController = {};

resourceController.create = async (req, res) => {
    try {
        const { type, id, firstName, lastName, role, department, status } = req.body;
        const user = req.tokenData._id;
        const data = { type, id, firstName, lastName, role, department, user, status };

        // Save resource to MongoDB
        const resource = new Resource(data);
        const savedResource = await resource.save();
        
        res.json(savedResource);  // Responding early to confirm saving to MongoDB

        const fullname = `${firstName} ${lastName}`;
        const formData = {
            dia_name: fullname,
            dia_department: department,
            dia_role: role,
            dia_id: id
        };

        const resourceId = '6799792d-cd24-ef11-840a-002248d61d46'; // Replace with your actual resource ID
        const authorizationToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL29yZ2NkMzVkMjU4LmNybTguZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTIwMzU3MTEtNTY0MC00OGU1LWJkNzEtOGQ1Yzg1ZGU4ODQwLyIsImlhdCI6MTcxNzk5NTQ0MSwibmJmIjoxNzE3OTk1NDQxLCJleHAiOjE3MTc5OTkzNDEsImFpbyI6IkUyTmdZR0RYaVBreFU2LzJ0M1B1Qk9XcEg3K21Bd0E9IiwiYXBwaWQiOiI1ZjBlZTFlMy1jNDdlLTQ0ZmItYTIzZi1kZDFiNGZiYzdkN2IiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lMjAzNTcxMS01NjQwLTQ4ZTUtYmQ3MS04ZDVjODVkZTg4NDAvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI5YTQzMWRkMy0zMmMwLTRmYzQtYTEyNi1hMTQyYjdjMjBhNzgiLCJyaCI6IjAuQVQ0QUVWY0Q0a0JXNVVpOWNZMWNoZDZJUUFjQUFBQUFBQUFBd0FBQUFBQUFBQUEtQUFBLiIsInN1YiI6IjlhNDMxZGQzLTMyYzAtNGZjNC1hMTI2LWExNDJiN2MyMGE3OCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImUyMDM1NzExLTU2NDAtNDhlNS1iZDcxLThkNWM4NWRlODg0MCIsInV0aSI6IkVaQ0dfR2JmUWtHdmpRVVVQRnRhQUEiLCJ2ZXIiOiIxLjAifQ.UkQX1dEqKmQvEMuHRaxxyVrFl3jHOeUVjfMEYM5vgxUwig91ttNpaY6wS9-j8oQ87TXQjhN4b6ajRM0pfH196pr-cPUhgxbh94WQYuHYzUwhvwt5fBtBQpdqaVSxi-O68kvqTz-wTTBWPSijP226E4tKI--aj9ByM972-gTFpaXNJ3Cz8pqf8ueTnO20Nvh-oeGs4zk-7ypIWmRbtrPyT-IXNge8lQQ95TpMpejlfI9luVW-FhHqu9ntczPpLdXPbc9Vc2ZjX7xYuiMbAJ2KBTlqTBNvZKdCC4FJxU2tIei5EZuTMZklzDnley_CPzJWY8nSl8EZd-ifwZwNIcb5xA'; // Replace with your actual token

        try {
            const response = await axios.patch(
                `https://orgcd35d258.crm8.dynamics.com/api/data/v9.0/dia_productresource(${resourceId})`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authorizationToken}`
                    }
                }
            );

            // Check if the Dynamics 365 update was successful
            if (response.status !== 204) { // Adjust status check based on Dynamics 365 API documentation
                console.error('Error updating resource in Dynamics 365:', response.statusText);
                return res.status(500).json({ error: `Error updating resource in Dynamics 365: ${response.statusText}` });
            }
        } catch (err) {
            if (err.response) {
                console.error('Error updating resource in Dynamics 365:', err.response.statusText, err.response.data);
                return res.status(500).json({ error: `Error updating resource in Dynamics 365: ${err.response.statusText}` });
            }
            console.error('Error updating resource in Dynamics 365:', err.message);
            return res.status(500).json({ error: 'Error updating resource in Dynamics 365' });
        }
    } catch (err) {
        console.error('Error creating resource:', err);
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
