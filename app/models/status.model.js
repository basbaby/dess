const mongoose = require('mongoose');
const azureStatus = mongoose.Schema({
    "login": Boolean,
    "devops": Boolean,
    "build": Boolean,
    "buildvar": Boolean,
    "projectId": String,
    "userId": String,
}, { timestamps: true }
);

module.exports = mongoose.model('azureStatus', azureStatus) 