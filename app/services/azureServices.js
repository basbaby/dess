
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const db = require("../models");

const fs = require('fs');
const yaml = require('js-yaml');
const { response } = require("express");

const moment = require('moment');
const { setTimeout } = require("timers");

let dbService = require("../services/dbService");
let projectService = require("../services/projectServices");
let gitService = require("../services/gitService");
let jenkinsService = require("../services/jenkinsService");
const axios = require('axios')
// let scriptPath = "apiops-ms-azure-node/scripts/"
var rootFolder = __dirname.split('/').pop();
console.log(rootFolder);
let scriptPath = 'sh ' + __dirname.split('/app/')[0] + '/scripts/';


let acrConfig = require('../models/acr-model');
let pipelinePermission = require('../models/pipeline-permission-model');
let pipelineVarModel = require('../models/pipeline-variable-model');
const pipelineVariable = require('../models/pipeline-variable-model');
let releaseDef = require('../models/release.def.model');
let releaseEnv = require('../models/release.env.model');

let headers = {
    'Content-Type': 'application/json',
    'Authorization': ''
};
execShellCommand = async (command, env) => {
    console.log(rootFolder);
    const { stdout, stderr } = await exec(command, { env: env });
    if (stderr) {
        global.io.emit('buildupdate', { message: stderr, date: moment().format('LLLL'), status: 'console' });
        console.warn('Exit from script ' + command + ':' + stderr);
        return stderr
    }
    console.log("OUTPUT FOR CMD:" + command);
    console.log(stdout);
    return stdout;
};

const AzureResource = db.azResources;
const BuildPipeline = db.buildPipeline;
const BuildProject = db.buildProject;
var env = Object.create(process.env);
exports.azureApiPostFunction = async function (url, env, obj) {
    try {
        headers["Authorization"] = "Basic " + env.azureToken;
        const resp = await axios({ method: 'POST', url: url, headers: headers, data: obj });
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err;
    }
}
exports.gitWebHookApi = async function (env) {
    try {
        headers["Authorization"] = "token " + env.gitPat;
        headers["Accept"] = "application/vnd.github.v3+json";
        var obj = { "config": { "url": env.jenkinsServer + "/github-webhook/", "content_type": "application/json", "secret": "", "insecure_ssl": "", "token": "", "digest": "" } }
        console.log(obj);
        const resp = await axios({ method: 'POST', url: "https://api.github.com/repos/" + env.gitUsername + "/" + env.projectName + "/hooks ", headers: headers, data: obj });
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err;
    }
}
exports.azureApiPatchFunction = async function (url, env, obj) {
    try {
        headers["Authorization"] = "Basic " + env.azureToken;
        headers["Content-Type"] = "application/json"
        const resp = await axios({ method: 'PATCH', url: url, headers: headers, data: obj });
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err;
    }
}
exports.azureApiGetFunction = async function (url, env) {
    try {
        headers["Authorization"] = "Basic " + env.azureToken;
        const resp = await axios({ method: 'GET', url: url, headers: headers });
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err;
    }
}
exports.azureApiUploadFunction = async function (env, filename, file) {
    try {
        headers["Authorization"] = "Basic " + env.azureToken;
        headers["Content-Type"] = "application/octet-stream";
        const resp = await axios({ method: 'POST', url: "https://dev.azure.com/" + env.orgName + "/" + env.projectName + "/_apis/distributedtask/securefiles?api-version=5.0-preview.1&name=" + filename, headers: headers, data: file });
        return resp.data;
    } catch (e) {
        console.error(e)
        return e;
    }
}
exports.createMuleVariables = async function (env) {
    try {
        pipelineVarModel.name = "release"
        pipelineVarModel.variables = {
            "FILENAME": {
                "isSecret": false, "value": "$(Release.PrimaryArtifactSourceAlias)/drop/target/**.jar"
            },
            "PLATFORM": {
                "isSecret": false, "value": "https://anypoint.mulesoft.com/"
            },
            "REGION": {
                "isSecret": false, "value": "us-east-1"
            },
            "RUNTIME": {
                "isSecret": false, "value": "4.3.0"
            },
            "WORKERS": {
                "isSecret": false, "value": "1"
            },
            "WORKER_SIZE": {
                "isSecret": false, "value": 1
            }
        }
        pipelineVarModel.variableGroupProjectReferences[0].name = "release";
        pipelineVarModel.variableGroupProjectReferences[0].projectReference.id = env.projectId;
        return this.azureApiPostFunction("https://dev.azure.com/" + env.orgName + "/" + env.projectName + "/_apis/distributedtask/variablegroups?api-version=6.0-preview.2", env, pipelineVarModel)
    } catch (e) {
        throw Error("Something happend" + e);
    }
}
exports.azureAcrServiceConn = async function (env) {
    acrConfig.authorization.parameters.tenantid = env.tenantId;
    //acrConfig.authorization.parameters.scope = env.acr_id;
    acrConfig.authorization.parameters.loginServer = env.acr_name + ".azurecr.io";
    acrConfig.authorization.parameters.servicePrincipalId = env.azusername;
    acrConfig.authorization.parameters.serviceprincipalkey = env.azpassword;
    acrConfig.data.registryId = env.acr_id;
    acrConfig.data.subscriptionId = env.subscriptionId;
    acrConfig.data.subscriptionName = env.subscriptionName;
    acrConfig.name = env.dockerServiceConnection;
    acrConfig.serviceEndpointProjectReferences[0].name = env.dockerServiceConnection;
    acrConfig.serviceEndpointProjectReferences[0].projectReference.id = env.projectId;
    acrConfig.serviceEndpointProjectReferences[0].projectReference.name = env.projectName;
    acrConfig.url = "https://" + env.acr_name + ".azurecr.io"
    console.log(acrConfig);
    try {
        return this.azureApiPostFunction("https://dev.azure.com/" + env.orgName + "/" + env.projectName + "/_apis/serviceendpoint/endpoints?api-version=6.0-preview.4", env, acrConfig);
    } catch (e) {
        throw Error("Something occured");
    }
}
exports.azureScAllowAll = async function (id, env) {
    pipelinePermission.resource.id = id;
    console.log(pipelinePermission);
    try {
        return this.azureApiPatchFunction("https://dev.azure.com/" + env.orgName + "/" + env.projectName + "/_apis/pipelines/pipelinePermissions/endpoint/" + id + "?api-version=5.1-preview.1", env, pipelinePermission);
    } catch (e) {
        throw Error("Something occured");
    }
}
exports.getAzureResources = async function (userId, req) {
    try {
        var resource = await dbService.dbGet("/api/db/v1/azresource", userId, req.headers["x-access-token"])
        return resource;
    } catch (e) {
        // Log Errors
        throw Error('No resource found')
    }
}
exports.deleteAzureResources = async function (userId, req) {

    try {
        let deleteObj = {
            "id": req.body.id
        }
        let resources = await dbService.dbDelete("/api/db/v1/azresource", userId, deleteObj, req.headers["x-access-token"]);
        return resources;
    } catch (e) {
        // Log Errors
        throw Error('No resource found')
    }
}
exports.checkAksStatus = async function (userId, aks) {
    try {
        var aksStatus = await AzureResource.find({ userId: userId, aks_cluster_name: aks, aks_created: true });
        return aksStatus;
    } catch (e) {
        throw Error('No resources found');
    }
}
exports.createResources = async function (userId, req) {
    console.log("Inside rty1");
    try {
        console.log("Inside rty");
        let resourceObj = req.body;
        env = resourceObj;
        console.log(env);
        let resources = await dbService.dbPost("/api/db/v1/azresource", userId, resourceObj, req.headers["x-access-token"]);
        console.log(resources);
        execShellCommand(scriptPath + "create-azure-resources.sh", env);
        return resources;

    } catch (e) {
        throw Error('No resources found' + e);
    }
}
exports.getAksStatus = async function (userId, reqBody) {
    try {
        let aksStatus = dbService.dbGet("/api/db/v1/azresource", userId, req.headers["x-access-token"])
        return aksStatus
    } catch (e) {
        throw Error('No status found' + e)
    }
}

exports.checkBuildStatus = async function (env, buildId) {
    env.build_id = buildId;
    console.log(env);
    try {
        const intervalObj = setInterval(async () => {
            console.log('interviewing the interval');
            let checkPipeline = await execShellCommand(scriptPath + "check-pipeline.sh", env);
            var buildResult = await this.parseJson(checkPipeline);
            global.io.emit('buildupdate', { message: 'Build ' + buildResult.status, date: moment().format('LLLL'), status: 'console' });
            if (buildResult.status == 'completed') {
                clearInterval(intervalObj);
                global.io.emit('buildupdate', { message: 'Build ' + buildResult.status, date: moment().format('LLLL'), status: 'console' });
                // updateProject(env.projectName, id, resourceGrp);
            }
        }, 2000);
    } catch (e) {
        throw Error(e);
    }

}

exports.getProjectBuild = async function (userId, req) {
    try {
        BuildProject.find({ userId: guserId, projectId: req.query.id }, (err, status) => {
            if (err) {
                return ({ message: 'NOT_FOUBD' });
            }
            return status;
        })
    } catch (e) {
        throw Error('No build found');
    }
}


exports.deleteProjectBuild = async function (userId, req) {
    try {
        BuildPipeline.deleteOne({ userId: userId, projectName: req.body.projectName }, (err, response) => {
            if (err) {
                return ({ message: 'No builds found' });
            }
            return response;
        })
    } catch (e) {
        throw Error('No build found');
    }
}
exports.createAzureBuild = async function (env) {
    var azLogin = await execShellCommand(scriptPath + "az-login.sh", env);
    global.io.emit('buildupdate', { message: azLogin, date: moment().format('LLLL'), status: 'console' });
    var azAccount = await execShellCommand(scriptPath + "account-show.sh", env);
    var accountInfo = await this.parseJson(azLogin);
    env.subscriptionId = accountInfo[0].id;
    env.tenantId = accountInfo[0].tenantId;
    env.subscriptionName = accountInfo[0].name;
    let acrResult = await execShellCommand(scriptPath + "get-acr-id.sh", env);
    var gacridObj = await this.parseJson(acrResult);
    env.acr_id = gacridObj.id;
    env.acr_server = gacridObj.loginServer;
    env.acr_name = gacridObj.name;
    global.io.emit('buildupdate', { message: 'Azure Devops: Creating Project', date: moment().format('LLLL'), status: 'done' });
    let devopRes = await execShellCommand(scriptPath + "az-devops-create.sh", env);
    let devopsObj = await this.parseJson(devopRes);
    env.projectId = devopsObj.id;

    console.log(env);

    let gitRepo = await execShellCommand(scriptPath + "git-repo-create.sh", env);
    global.io.emit('buildupdate', { message: 'Git Repository created', date: moment().format('LLLL'), status: 'done' });


    let gitPullPush = await execShellCommand(scriptPath + "git-pull-push.sh", env);
    let gitSVCRes = await execShellCommand(scriptPath + "git-service-connection.sh", env);
    var gitscObject = await this.parseJson(gitSVCRes);
    env.github_service_connection_id = gitscObject.id;
    console.log(env.github_service_connection_id);
    await this.azureScAllowAll(env.github_service_connection_id, env);
    // let azSVCRes = await execShellCommand(scriptPath + "acr-service-connection.sh", env);
    let azSVCRes = await this.azureAcrServiceConn(env);
    console.log("Response from devops");
    console.log(azSVCRes);
    env.acr_service_id = azSVCRes.id;
    await delay(20000);
    await this.azureScAllowAll(env.acr_service_id, env);
    let createBuldVar = await execShellCommand(scriptPath + "create-build-variables.sh", env);
    console.log("Calling build pipeline");
    global.io.emit('buildupdate', { message: 'Azure Devops: Creating Build pipeline', date: moment().format('LLLL'), status: 'done' });
    if (env.projectType === 'mule') {
        // await execShellCommand(scriptPath + "create-mule-settings.sh", env);
        const xmlFile = fs.readFileSync("settings.xml");
        let settingUpload = await this.azureApiUploadFunction(env, "settings.xml", xmlFile);
        console.log(settingUpload);
        var settingFilePermission = [{ "authorized": true, "id": settingUpload.id, "name": "settings.xml", "type": "securefile" }];
        console.log(settingFilePermission);
        await this.azureApiPatchFunction("https://dev.azure.com/" + env.orgName + "/" + env.projectName + "/_apis/build/authorizedresources?api-version=5.1-preview.1", env, settingFilePermission);
    }
    let buildPipe = await execShellCommand(scriptPath + "build-pipeline.sh", env);
    global.io.emit('buildupdate', { message: buildPipe, date: moment().format('LLLL'), status: 'console' });
    let buildRes = await this.parseJson(buildPipe);
    let resObj = {
        buildId: buildRes.id,
        buildName: buildRes.definition.name,
        projectName: projectDetails.projects[0].projectName,
        projectId: projectDetails.projects[0]._id
    }
    let buildUpdate = await dbService.dbPost("/api/db/v1/azprojectbuild", userId, resObj, req.headers["x-access-token"]);
    this.checkBuildStatus(env, buildRes.id);
    return buildUpdate;
}

exports.createJenkinsBuild = async function (env) {
    let jenkinsConfig = await execShellCommand(scriptPath + "create-jenkins-config.sh", env);
    console.log(env);
    // let gitWebHook = await execShellCommand(scriptPath + "git-webhook.sh", env);
    let webhook = await this.gitWebHookApi(env);
    console.log(webhook);
    let jenkinsBuild = await execShellCommand(scriptPath + "create-jenkins-pipeline.sh", env);
    return jenkinsBuild;
}
exports.startBuildProject = async function (userId, req) {
    try {
        let retBuildObj = null;
        let projectDetails = await projectService.getProject(userId, req);
        let resources = await this.getAzureResources(userId, req);
        let gitRes = await gitService.retrieveGitRepo(userId, req);
        let jenkinsRes = await jenkinsService.getJenkinsSettings(userId, req);

        env = { ...gitRes[0], ...resources[0], ...projectDetails.projects[0], ...jenkinsRes[0] };
        let gitExecute = await execShellCommand(scriptPath + "git-process.sh", env);
        env.azureToken = await Buffer.from(resources[0].azpusername + ":" + resources[0].azDevopsPat, "utf8").toString("base64");
        env.cloneOrCreate = "";
        env.projectDescription = "FirstProject";
        env.pipeline_description = "Automated Build  Pipeline for Project: " + projectDetails.projects[0].projectName;
        env.pipeline_folder = projectDetails.projects[0].projectName + '- Build Pipline';
        env.pipeline_name = projectDetails.projects[0].projectName + ' Pipeline';
        env.git_service_connection_name = projectDetails.projects[0]._id + 'GitServiceConnection1';
        env.gitRepo = projectDetails.projects[0].projectName;
        env.dockerServiceConnection = projectDetails.projects[0].projectName + 'DockerServiceConnection1';
        env.ROLE_ID = "8311e382-0749-4cb8-b61a-304f252e45ec";
        env.anypointUsername = "basil_njclabs";
        env.anypointPassword = "Mule123";
        env.gitType = req.body.gitType;
        env.orgName = resources[0].organization.split("/dev.azure.com/")[1];
        env.github_repo_url = 'https://github.com/' + gitRes[0].gitUsername + '/' + projectDetails.projects[0].projectName + '/';
        env.azureToken = await Buffer.from(resources[0].azpusername + ":" + resources[0].azDevopsPat, "utf8").toString("base64");

        console.log("before condition")
        if (env.cloudType === 'azure') {
            retBuildObj = await this.createAzureBuild(env);
        } else if (env.cloudType === 'jenkins') {
            console.log("inside jenkins")
            let gitRepo = await execShellCommand(scriptPath + "git-repo-create.sh", env);
            global.io.emit('buildupdate', { message: 'Git Repository created', date: moment().format('LLLL'), status: 'done' });


            let gitPullPush = await execShellCommand(scriptPath + "git-pull-push.sh", env);
            retBuildObj = await this.createJenkinsBuild(env);
        }

        return retBuildObj;



    } catch (e) {
        console.log(e);
        throw Error('Could not start Build' + e);
    }

}
exports.createMuleRelease = async (userId, req) => {
    try {

        let azureResource = await this.getAzureResources(userId, req);
        let projectResources = await projectService.getProject(userId, req);
        env = { ...azureResource[0] };
        env.azureToken = await Buffer.from(azureResource[0].azpusername + ":" + azureResource[0].azDevopsPat, "utf8").toString("base64");
        env.projectName = projectResources.projects[0].projectName;
        env.curlToken = await Buffer.from(azureResource[0].azpusername + ":" + azureResource[0].azDevopsPat, "utf8").toString("base64");
        console.log(env);
        env.orgName = azureResource[0].organization.split("/dev.azure.com/")[1];
        let buildRes = await this.azureApiGetFunction("https://dev.azure.com/" + env.orgName + "/" + env.projectName + "/_apis/build/builds", env);
        console.log(buildRes);
        env.projectId = buildRes.value[0].definition.project.id;
        env.buildId = buildRes.value[0].id;
        env.buildDefId = buildRes.value[0].definition.id;
        env.buildName = buildRes.value[0].definition.name;
        env.queueId = buildRes.value[0].queue.id;
        console.log(env);
        let releaseVariablesMule = await execShellCommand(scriptPath + "create-release-variables-mule.sh", env);
        this.createMuleVariables(env);

        if (req) {
            req.body.env.forEach((element, i) => {
                env.muleEnv = element.env;
                env.mulAppName = element.name;
                env.muleClientId = element.clientId;
                env.muleClientSecret = element.clentSecret;
                if (element.env == "Sandbox") {
                    env.sandboxUsername = element.username;
                    env.sandboxPassword = element.password;
                } else {
                    env.qaUsername = element.username;
                    env.qaPassword = element.password;
                }
            });
        }
        delay(3000);
        let variabGroupJson = await this.azureApiGetFunction("https://dev.azure.com/" + env.orgName + "/" + env.projectName + "/_apis/distributedtask/variablegroups?api-version=6.0-preview.2", env);
        // var variabGroupJson = await this.parseJson(varGroup);
        variabGroupJson.value.forEach(element => {
            if (element.name == 'release') {
                env.releaseVariableId = element.id;
            }
            if (element.name == 'release.Sandbox') {
                env.sandboxvariableid = element.id;
            }
            if (element.name == 'release.QA') {
                env.qavariableid = element.id;
            }
        });
        let muleCred = await execShellCommand(scriptPath + "create-mule-cred.sh", env);
        // let uploadCred = await execShellCommand(scriptPath + "az-upload-credentials.sh", env);
        const credentials = fs.readFileSync("credentials")
        let uploadCred = await this.azureApiUploadFunction(env, "credentials", credentials);
        env.muleSecureFileId = await uploadCred.id;
        console.log(env)
        delay(3000);
        // let sandboxEnv = new releaseEnv();
        console.log(releaseEnv);
        releaseEnv.deployPhases[0].deploymentInput.queueId = env.queueId;
        releaseEnv.deployPhases[0].workflowTasks[0].inputs.secureFile = env.muleSecureFileId;
        // let releaseDefJson = new releaseDef();
        releaseDef.environments.push(releaseEnv);
        console.log(releaseDef);
        let releaseResJson = await this.azureApiPostFunction("https://vsrm.dev.azure.com/" + env.orgName + "/" + env.projectName + "_apis/release/definitions?api-version=6.1-preview.4", env, releaseDef);
        // let releaseDef = await execShellCommand(scriptPath + "create-release-def.sh", env);
        // var releaseJson = await this.parseJson(releaseDef);
        env.releaseDefId = releaseResJson.id;
        global.io.emit('releaseupdate', { message: 'Creating release', date: moment().format('LLLL'), status: 'progress' });
        let createrelease = await execShellCommand(scriptPath + "create-release.sh", env);
    } catch (e) {
        console.log(e);
        throw Error(e)
    }
}
exports.createRelease = async (userId, req) => {
    let projectDetails = await projectService.getProject(userId, req);
    env.projectName = projectDetails.projects[0].projectName;
    try {
        if (projectDetails.projects[0].projectType === 'mule') {
            this.createMuleRelease(userId, req);
            return { message: "Started Mule Release" }
        }
    } catch (e) {
        throw Error(e);
    }
}
exports.checkRelease = async (env) => {
    try {
        let release = await execShellCommand(scriptPath + "kubectl-get-service.sh", env);
        return release
    } catch (e) {
        throw Error(e);
    }

}
exports.deployApplication = async (userId, req) => {
    try {
        let projectDetails = await projectService.getProject(userId, req);

        let resources = await this.getAzureResources(userId, req);
        env = resources[0];
        env.projectName = projectDetails.projects[0].projectName;
        env.kubectl_secret_name = projectDetails.projects[0]._id + env.aks_cluster_name + Math.random();
        env.kubectl = "az";
        let aksCredentials = await execShellCommand(scriptPath + "aks-get-credentials.sh", env);
        let dockerSc = await execShellCommand(scriptPath + "acr-docker-service-connection.sh", env);
        let kubeCreate = await execShellCommand(scriptPath + "kube-create-yaml.sh", env);
        let fileContents = fs.readFileSync('./deployment.yaml', 'utf8');
        let data = yaml.safeLoadAll(fileContents);
        let nes_data = {
            imagePullSecrets: [{ name: env.kubectl_secret_name }]
        }
        Object.assign(data[0].spec.template.spec, nes_data);
        let yamlStr = yaml.safeDump(data[0]);
        fs.writeFileSync('data-out.yaml', yamlStr, 'utf8');
        let kubeApply = execShellCommand(scriptPath + "kubectl-apply.sh", env);
        let kubeService = execShellCommand(scriptPath + "combine-kubectl-files.sh", env);
        delay(5000);
        let interval = setInterval(async () => {
            let releaseResponse = await this.checkRelease(env);
            console.log(releaseResponse);
            var jsonRes = await this.parseJson(releaseResponse);
            console.log(jsonRes.status);
            if (jsonRes.status && jsonRes.status.loadBalancer && jsonRes.status.loadBalancer.ingress.length) {
                clearInterval(interval);
                console.log(jsonRes.status.loadBalancer && jsonRes.status.loadBalancer.ingress[0].ip);
                global.io.emit('deployment', { message: jsonRes.status.loadBalancer.ingress[0].ip, date: moment().format('LLLL'), status: 'done' });
            }
        }, 2000)

    } catch (e) {
        throw Error(e);
    }
}
exports.getBuildStatus = async (userId, req) => {
    try {
        env.projectName = req.query.projectName;
        let azureRes = this.getAzureResources(userId, req);
        env.organization = azureRes[0].organization;
        let pipelineList = await execShellCommand(scriptPath + "pipeline-list.sh", env);
        var jsonObj = await this.parseJson(pipelineList);
        console.log(jsonObj);
        if (jsonObj.length) {
            return ({ message: 'Build Exists' });
        } else {
            return ({ message: 'No Build' });
        }
    } catch (e) {
        throw Error(e);
    }
}
function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}
exports.parseJson = async (jsonStr) => {
    console.log("Inside parse");
    console.log(jsonStr)
    jsonStr = jsonStr.replace("This command is in preview. It may be changed/removed in a future release.", "");
    console.log(jsonStr);
    try {
        var jsonObj = JSON.parse(jsonStr);
        console.log(jsonObj);
        return jsonObj;
    } catch (e) {
        console.log(e);
        throw Error(e);
    }
}