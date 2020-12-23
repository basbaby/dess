const axios = require('axios')
const config = require("../config/app.config");

let headers = {
    'Content-Type': 'application/json',
    'x-access-token': ''
};
let dbService = require("../services/dbService");
var env = Object.create(process.env);
execShellCommand = async (cmd, env) => {
    const exec = require('child_process').exec;
    exec(cmd, { env: env }, (error, stdout, stderr) => {
        if (error || !stdout) {
            console.log(error);
            global.io.emit('buildupdate', { message: error, date: moment().format('LLLL'), status: 'console' });
            console.warn('Exit from script' + error);
        }
        console.log(stdout);
        return stdout;
    });
};
exports.retrieveGitRepo = async (userId, req) => {
    try {
        const resp = await dbService.dbGet("/api/db/v1/repo", userId, req.headers["x-access-token"]);
        return resp.gitRepo;
    } catch (err) {
        // Handle Error Here
        throw Error(e);
    }
};

exports.deleteGitRepos = async (userId, req) => {
    try {
        const resp = await dbService.dbDelete("/api/db/v1/repo", userId, null, req.headers["x-access-token"]);
        return resp;
    } catch (err) {
        // Handle Error Here
        throw Error(e);
    }
};

exports.deleteGitRepo = async (userId, req) => {
    try {
        const resp = await dbService.dbDelete("/api/db/v1/repo?id=" + req.query.id, userId, null, req.headers["x-access-token"]);
        return resp;
    } catch (err) {
        // Handle Error Here
        throw Error(e);
    }
};



exports.createGitRepo = async function (userId, req) {

    try {
        env.gitUsername = req.body.gitUsername;
        env.github_token = req.body.gitPat;
        env.gitRepo = req.body.gitRepo;
        env.cloneOrCreate = "-n";
        env.codeRepo = "";
        let execcuted = await execShellCommand("sh git-repo-create.sh", env);
        let postObj = {
            gitUsername: req.body.gitUsername,
            gitPat: req.body.gitPat,
            gitRepo: req.body.gitRepo
        }
        let createdGit = dbService.dbPost("/api/db/v1/repo", userId, postObj, req.headers["x-access-token"])
        return createdGit
    } catch (e) {
        throw Error("Error creating git repo" + e);
    }


}