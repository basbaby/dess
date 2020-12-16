const mongoose = require('mongoose');
const buildPipeline = mongoose.Schema({
    "userId": String,
    "buildId": String,
    "buildName": String,
    "projectName": String,
    "projectId": String
},
    { timestamps: true }
);

module.exports = mongoose.model('buildPipeline', buildPipeline) 