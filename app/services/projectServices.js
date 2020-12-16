
const db = require("../models");
const { user } = require("../models");
let dbService = require("../services/dbService");
const Project = db.project;

exports.createProject = async function (userId, req) {
    // req.body.userId = userId;
    try {
        var jsonObj = {
            "cloudType": req.body.cloudType,
            "projectName": req.body.projectName,
            "projectType": req.body.projectType
        }
        let project = await dbService.dbPost("/api/db/v1/project", userId, jsonObj, req.headers["x-access-token"]);
        console.log(project);
        return project;
    } catch (e) {
        throw Error("Could not connect to db" + e)
    }

}
exports.deleteProject = async function (userId, req) {

    try {
        Project.deleteMany({ userId: userId, _id: req.body.id }, (err, response) => {
            return response;
        })
    } catch (e) {
        // Log Errors
        throw Error('No resource found')
    }
}
exports.deleteProjects = async function (userId, req) {

    try {
        let projects = await dbService.dbDelete("/api/db/v1/project", userId, req.headers["x-access-token"]);
        return projects;
    } catch (e) {
        // Log Errors
        throw Error('No projects found')
    }
}
exports.getProjects = async function (userId, req) {

    try {
        let projects = await dbService.dbGet("/api/db/v1/project", userId, req.headers["x-access-token"]);
        return projects;
    } catch (e) {
        throw Error('No resources found' + e);
    }
}
exports.getProject = async function (userId, req) {
    try {
        let projects = await dbService.dbGet("/api/db/v1/detail/project?id=" + req.query.id, userId, req.headers["x-access-token"]);
        return projects;
    } catch (e) {
        throw Error('No resources found');
    }
}