let AzureService = require("../services/azureServices.js");
let AuthService = require("../services/authService.js");


exports.azureresources = async function (req, res) {
    try {
        let azResource = await AzureService.getAzureResources(AuthService.getToken(req), req);
        res.status(200).send(azResource);
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.deleteresource = async function (req, res) {
    console.log(req.body.id)
    try {
        let azResource = await AzureService.deleteAzureResources(AuthService.getToken(req), req);
        res.status(200).send(azResource);
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }

}
exports.checkakscreated = async function (req, res) {
    try {
        let aksCreated = await AzureService.checkAksStatus(AuthService.getToken(req), req.body.aks_cluster_name);
        if (aksCreated.length > 0) {
            res.status(200).send({ message: "Success" });
        } else {
            res.status(400).send({ message: "AKS not created / not found" });
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.createresource = async function (req, res) {
    try {
        let createdResource = await AzureService.createResources(AuthService.getToken(req), req);
        res.status(200).send({ data: createdResource });
    } catch (e) {
        res.status(400).send({ message: 'Could not save resources' + e });
    }


}
exports.getaksstatus = async function (req, res) {
    try {
        let azResource = await AzureService.getAksStatus(AuthService.getToken(req), req);;
        res.status(200).send(azResource);
    } catch (e) {
        res.status(400).send({ message: 'Could not save retrieve aks status' });
    }
}

exports.getprojectbuild = async function (req, res) {
    try {
        let projectBuild = await AzureService.getProjectBuild(AuthService.getToken(req), req);
        res.status(200).send({ projectBuild });
    } catch (e) {
        res.status(404).send({ message: "No build found" });
    }
}
exports.deleteprojectbuild = async function (req, res) {
    try {
        let projectBuild = await AzureService.deleteProjectBuild(AuthService.getToken(req), req);
        res.status(200).send({ projectBuild });
    } catch (e) {
        res.status(404).send({ message: "No build found" });
    }
}
exports.startprojectbuild = async (req, res) => {
    try {
        let buildProject = await AzureService.startBuildProject(AuthService.getToken(req), req);
        res.status(200).send({ buildProject });
    } catch (e) {
        res.status(404).send({ message: "Could not start build" + e });
    }
}

exports.createrelease = (req, res) => {
    console.log("Inside release");
    try {
        let release = AzureService.createRelease(AuthService.getToken(req), req);
        res.status(200).send(release);
    } catch (e) {
        res.status(400).send({ message: "Error occured" + e });
    }
}
exports.deployapplication = (req, res) => {
    try {
        let deployedApp = AzureService.deployApplication(AuthService.getToken(req), req);
        res.status(200).send({ message: "Started Deployment" })
    } catch (e) {
        res.status(400).send({ message: "Error deploying application" + e })
    }
}

exports.checkbuildstarted = (req, res) => {
    try {
        let build = AzureService.checkBuildStatus(userId, req);
        res.status(200).send(build);
    } catch (e) {
        res.status(400).send({ message: "Error occured in retrievin list" + e });
    }
}
