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
        const authorizationToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL29yZ2NkMzVkMjU4LmNybTguZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTIwMzU3MTEtNTY0MC00OGU1LWJkNzEtOGQ1Yzg1ZGU4ODQwLyIsImlhdCI6MTcxODEwNjkyOCwibmJmIjoxNzE4MTA2OTI4LCJleHAiOjE3MTgxMTA4MjgsImFpbyI6IkUyTmdZS2pYdXQzMVdiTm9VcGFtUXMvT05ST3ZBd0E9IiwiYXBwaWQiOiIxMjdkNDE5My1jZGNiLTQzYzEtYmFkYy1lNjEwNzM2NmE5ZmIiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lMjAzNTcxMS01NjQwLTQ4ZTUtYmQ3MS04ZDVjODVkZTg4NDAvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiJlNTYyMWI4Ny1hODg2LTQ4ZTktYWE5ZS1iMTEyMThkZDhmMTQiLCJyaCI6IjAuQVQ0QUVWY0Q0a0JXNVVpOWNZMWNoZDZJUUFjQUFBQUFBQUFBd0FBQUFBQUFBQUEtQUFBLiIsInN1YiI6ImU1NjIxYjg3LWE4ODYtNDhlOS1hYTllLWIxMTIxOGRkOGYxNCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImUyMDM1NzExLTU2NDAtNDhlNS1iZDcxLThkNWM4NWRlODg0MCIsInV0aSI6ImplMkF0bEpMWWttVVAzbElwcVI3QUEiLCJ2ZXIiOiIxLjAifQ.nR45tkKcf29jz3pmd2tikEI3pDDLbUxiUc3fo8UWV_1s-EluLOMI5ctOnJE5nRuPG_QYrtbR1HsNqXB9x_gHx6Kf-h7r2sI_UUSU2ub-FNaThv_SLS1hCY20aDR43__yPVjDDKR8ptgkadw-Roug5o9YxeJKE5n0wNhhdCY6CpL335Lr3aNa-GV4BIEX1ryJCJYLVbbVOSO9huddUVpQG7Kiqt5ZNX6_Dr-3Y_Ll72Ti4W8nCa96nGE_xlu6BosMG42ao5QCxa7_1a0kz9lnCvG8luEKJ4r0AHtI5GwXdYKRkfFxpCAXg9ZmJmPqbtbh3LCwYxBfWAMFisActYMbjQ'; // Replace with your actual token

        try {
            const response = await axios.post(
                `https://orgcd35d258.crm8.dynamics.com/api/data/v9.0/dia_productresources`,
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
