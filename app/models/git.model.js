const mongoose = require('mongoose');
const { series } = require('async');

const gitSchema = mongoose.Schema({
    userId: String,
    gitUsername: String,
    gitPat: String
}, { timestamps: true })

module.exports = mongoose.model('git', gitSchema)