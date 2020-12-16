const mongoose = require('mongoose');
const buildProject = mongoose.Schema({
    projectId: String,
    userId: String,
    cloudType: String,
    containerName: String,
    resourceGroupName: String,
    location: String,
    projectName: String,
    projectType: String,
    startedBuild: Boolean,
    finishedBuild: Boolean,
    gitRepo: String
},
    { timestamps: true }
);

module.exports = mongoose.model('buildProject', buildProject) 