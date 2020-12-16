
let AuthService = require("../services/authService.js");
let GitService = require("../services/gitService.js");
exports.creategitrepos = async (req, res) => {
    try {
        let createdRepo = await GitService.createGitRepo(AuthService.getToken(req), req);
        res.status(200).send(createdRepo);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}
exports.getgitrepos = async (req, res) => {

    try {
        let repo = await GitService.retrieveGitRepo(AuthService.getToken(req), req);
        res.status(200).send(repo);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}
exports.deletegitrepos = async (req, res) => {
    try {
        let repo = await GitService.deleteGitRepos(AuthService.getToken(req), req);
        res.status(200).send(repo);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }

}
exports.deletegitrepo = async (req, res) => {
    try {
        let repo = await GitService.deleteGitRepo(AuthService.getToken(req), req);
        res.status(200).send(repo);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }

}
