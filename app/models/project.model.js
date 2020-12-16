const mongoose = require('mongoose');
const { series } = require('async');

const projectSchema = mongoose.Schema({
    userId: String,
    cloudType: String,
    projectName: String,
    projectType: String,
    gitUrl: String,
    buildId: String,
    buildComplete: String,
    resourceGroupName: String
}, { timestamps: true })

module.exports = mongoose.model('project', projectSchema)