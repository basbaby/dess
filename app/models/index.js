const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.azResources = require("./azresources.model");
db.project = require("./project.model");
db.buildPipeline = require("./buildpipeline.model");
db.azureStatus = require("./status.model");
db.git = require("./git.model");
db.buildProject = require("./buildproject.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
