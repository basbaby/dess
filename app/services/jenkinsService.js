
const db = require("../models");
const { user, project } = require("../models");

const Jenkins = db.jenkins;
let DbService = require("../services/dbService");

exports.createJenkinsSettings = async function (userId, req) {
    try {
        console.log(userId);
        let jenkins = await DbService.dbPost("/api/v1/db/jenkins", userId, req.body, req.headers["x-access-token"]);
        console.log(jenkins);
        return jenkins;
    } catch (e) {
        throw Error('Could not create git resource' + e);
    }
}

exports.getJenkinsSettings = async function (userId, req) {
    try {
        var jenkins = await DbService.dbGet("/api/v1/db/jenkins", userId, req.headers["x-access-token"]);
        console.log(jenkins);
        return jenkins;
    } catch (e) {
        throw Error('No resources found' + e);
    }
}

exports.deleteJenkinsSettings = async function (userId, req) {
    try {
        let deletedCount = await DbService.dbDelete("/api/v1/db/jenkins", userId, null, req.headers["x-access-token"]);
        return deletedCount;
    } catch (e) {
        throw Error(e);
    }
}
exports.deleteJenkinsSetting = async function (userId, req) {
    try {
        let deletedCount = await DbService.dbDelete("/api/v1/db/jenkins?id=" + req.query.id, userId, req.headers["x-access-token"]);
        return deletedCount;
    } catch (e) {
        throw Error(e);
    }
}