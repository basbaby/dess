let ProjectService = require("../services/projectServices.js");
let AuthService = require("../services/authService.js");

// const Project = db.project;
//to be changed
// updateGitProject = async function (projectid, giturl) {
//     Project.updateMany({ _id: projectid }, { $set: { gitUrl: giturl } }, (err, stat) => {
//         if (err) {
//             res.status(500).send({ message: "something occured" });
//         }
//     })
// }
//to be changed
// updateProject = async function (project, id, rg) {
//     Project.updateMany({ projectName: project }, { $set: { buildId: id, buildComplete: true, resourceGroupName: rg } }, (err, project) => {
//         console.log("Project Build updated");
//     })
// }
exports.createproject = async function (req, res) {
    try {
        let createProject = await ProjectService.createProject(AuthService.getToken(req), req);
        res.status(200).send({ createProject });
    } catch (e) {
        console.log("Inside catch");
        res.status(404).send({ message: "Could not create project" + e });
    }

};
exports.deleteproject = async function (req, res) {
    try {
        let deleteProject = await ProjectService.deleteProject(AuthService.getToken(req), req);
        res.status(200).send({ deleteProject });
    } catch (e) {
        res.status(404).send({ message: "Could not create project" });
    }

};
exports.deleteprojects = async function (req, res) {

    try {
        let deleteProject = await ProjectService.deleteProjects(AuthService.getToken(req));
        res.status(200).send({ deleteProject });
    } catch (e) {
        res.status(404).send({ message: "Could not delete project" });
    }
};
exports.getprojects = async function (req, res) {
    try {
        let projects = await ProjectService.getProjects(AuthService.getToken(req), req);
        res.status(200).send({ projects });
    } catch (e) {
        res.status(404).send({ message: "Could not retrieve project" + e });
    }
}
exports.getproject = async function (req, res) {
    try {
        let projects = await ProjectService.getProject(AuthService.getToken(req), req);
        res.status(200).send({ data: projects });
    } catch (e) {
        res.status(404).send({ message: "Could not retrieve project" + e });
    }
}
