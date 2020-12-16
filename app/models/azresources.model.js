const mongoose = require('mongoose');
const azureResources = mongoose.Schema({
    "userId": String,
    "azusername": String,
    "azpassword": String,
    "aztenantid": String,
    "resource_group_name": String,
    "aks_cluster_name": String,
    "containerRepository": String,
    "azure_container_registry_name": String,
    "location": String,
    "organization": String,
    "acr_registry_id": String,
    "aks_created": Boolean
}, { timestamps: true }
);

module.exports = mongoose.model('azureResources', azureResources) 