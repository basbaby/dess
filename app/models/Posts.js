const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    cloudType: String,
    clusterName: String,
    projectName: String
})

module.exports = mongoose.model('Project', projectSchema)