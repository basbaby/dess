
const { exec } = require("child_process");
const db = require("../models");
const { authJwt } = require("../middlewares");
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");// to be removed

const fs = require('fs');
const yaml = require('js-yaml');
const { response } = require("express");

const moment = require('moment');
const { setTimeout } = require("timers");
const organization = "https://dev.azure.com/njclabsmicrolabs";
getToken = (req, res) => {
    let token = req.headers["x-access-token"];
    jwt.verify(token, config.secret, (err, decoded) => {
        // console.log(decoded);
        return decoded.id;
    })
};

execShellCommand = (cmd, env) => {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, { env: env }, (error, stdout, stderr) => {
            if (error || !stdout) {
                console.log(error);
                global.io.emit('buildupdate', { message: error, date: moment().format('LLLL'), status: 'console' });
                console.warn('Exit from script' + error);
            }
            console.log(stdout);
            global.io.emit('buildupdate', { message: stdout, date: moment().format('LLLL'), status: 'console' });
            resolve(stdout);
        });
    });
};

const AzureResource = db.azResources;
const Project = db.project;
const BuildPipeline = db.buildPipeline;
const AzureStatus = db.azureStatus;
const BuildProject = db.buildProject;
const GitHub = db.git;
var env = Object.create(process.env);
updateGitProject = (projectid, giturl) => {
    Project.updateMany({ _id: projectid }, { $set: { gitUrl: giturl } }, (err, stat) => {
        if (err) {
            res.status(500).send({ message: "something occured" });
        }
    })
}
exports.respond = (socket_io) => {
    // this function expects a socket_io connection as argument

    // now we can do whatever we want:
    socket_io.on('news', function (newsreel) {

        // as is proper, protocol logic like
        // this belongs in a controller:

        socket.broadcast.emit(newsreel);
    });
}

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};
exports.azureresources = (req, res) => {
    db.azResources.find({ username: getToken(req, res) }, (err, resources) => {
        if (err) {
            res.status(400).send({ message: "Resource not found" });
        }
        res.status(200).send(resources);
    })
}

exports.deleteresource = (req, res) => {
    console.log(req.body.id)
    db.azResources.deleteMany({ username: getToken(req, res), _id: req.body.id }, (err, resources) => {
        console.log(resources);
        if (err) {
            res.status(400).send({ message: "Resource not found" });
        }
        res.status(200).send({ message: "Deleted resource" });
    })
}
exports.checkakscreated = (req, res) => {
    AzureResource.find({ username: getToken(req, res), aks_cluster_name: req.body.aks_cluster_name, aks_created: true }, (err, response) => {
        if (err)
            res.status(500).send({ message: "Internal Serve error" });
        return;
        if (response.length > 0) {
            res.status(200).send({ message: "Success" });
        } else {
            res.status(400).send({ message: "AKS not created / not found" });
        }
    })

}
updateStatus = (username, id, item) => {
    if (item == 'login') {
        AzureStatus.updateMany({ username: username, projectId: id }, { $set: { login: true } }, (err, stat) => {
            if (err) {
                res.status(500).send({ message: "something occured" });
            }
        })
    }
    if (item == 'devops') {
        AzureStatus.updateMany({ username: username, projectId: id }, { $set: { devops: true } }, (err, stat) => {
            if (err) {
                res.status(500).send({ message: "something occured" });
            }
        })
    }
    if (item == 'buildvar') {
        AzureStatus.updateMany({ username: username, projectId: id }, { $set: { buildvar: true } }, (err, stat) => {
            if (err) {
                res.status(500).send({ message: "something occured" });
            }
        })
    }
    if (item == 'build') {
        AzureStatus.updateMany({ username: username, projectId: id }, { $set: { build: true } }, (err, stat) => {
            if (err) {
                res.status(500).send({ message: "something occured" });
            }
        })
    }
}
updateProject = (project, id, rg) => {
    Project.updateMany({ projectName: project }, { $set: { buildId: id, buildComplete: true, resourceGroupName: rg } }, (err, project) => {
        console.log("Project Build updated");
    })
}
checkbuild = (id, rg) => {

    env.build_id = id;
    const intervalObj = setInterval(() => {
        console.log('interviewing the interval');
        execShellCommand("sh check-pipeline.sh", env).then(result => {
            var buildResult = JSON.parse(result);
            global.io.emit('buildupdate', { message: 'Build ' + buildResult.status, date: moment().format('LLLL'), status: 'console' });
            if (buildResult.status == 'completed') {
                clearInterval(intervalObj);
                global.io.emit('buildupdate', { message: 'Build ' + buildResult.status, date: moment().format('LLLL'), status: 'console' });
                updateProject(env.projectName, id, rg);
            }
        })
    }, 2000);

}
exports.createresource = (req, res) => {
    env.username = req.body.username;
    env.password = req.body.password;
    env.organization = req.body.organization;
    env.location = req.body.location;
    env.resource_group_name = req.body.resource_group_name;
    env.containerRepository = req.body.containerRepository;
    env.aks_cluster_name = req.body.aks_cluster_name;
    env.azure_container_registry_name = req.body.azure_container_registry_name
    console.log(env);
    const resources = new AzureResource({
        username: getToken(req, res),
        azusername: req.body.username,
        azpassword: req.body.password,
        organization: req.body.organization,
        location: req.body.location,
        resource_group_name: req.body.resource_group_name,
        containerRepository: req.body.containerRepository,
        aks_cluster_name: req.body.aks_cluster_name,
        azure_container_registry_name: req.body.azure_container_registry_name,
        aks_created: false
    });

    resources.save((err, response) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send({ message: 'Resources saved successfully', data: response });
        execShellCommand("sh az-login.sh", env).then(result => {
            global.io.emit('create-resource', { message: 'Resource Group Created', date: moment().format('LLLL'), status: 'console' });
            execShellCommand("sh rg-create.sh", env).then(result => {
                execShellCommand("sh acr-create.sh", env).then(result => {
                    global.io.emit('create-resource', { message: 'ACR Created', date: moment().format('LLLL'), status: 'console' });
                    execShellCommand("sh aks-cluster-create.sh", env).then(result => {
                        // res.json(result);
                        global.io.emit('create-resource', { message: 'AKS Created', date: moment().format('LLLL'), status: 'console' });
                        global.io.emit('create-resource', { message: 'Done', date: moment().format('LLLL'), status: 'done' });
                        AzureResource.updateMany({ username: getToken(req, res), aks_cluster_name: req.body.aks_cluster_name }, { $set: { aks_created: true } }, (err, response) => {
                            // if (err) {
                            //     res.status(500).send({ message: err });
                            //     return
                            // }
                            // res.status(200).send({ message: 'AKS created saved successfully', data: response });
                        })
                    })
                })
            })
        })
    })


}
exports.getaksstatus = (req, res) => {
    AzureResource.find({ username: getToken(req, res), aks_cluster_name: req.body.aks, _id: req.body.id }, (err, azureResource) => {
        if (err)
            res.status(500).send({ message: 'Error' });
        res.status(400).send(azureResource);
    })
}

exports.createproject = (req, res) => {
    const newProject = new Project({
        username: getToken(req, res),
        cloudType: req.body.cloudType,
        projectName: req.body.projectName,
        createdOn: req.body.createdOn,
        projectType: req.body.projectType,
        gitUrl: "",
        buildId: "",
        buildComplete: false,
        resourceGroupName: ""
    })

    newProject.save((err, response) => {
        if (err) {
            res.status(500).send({ message: 'Error saving project' });
        }
        res.status(200).send({ message: 'Project saved' });
    })
};
exports.creategitrepos = (req, res) => {
    console.log(req.body);
    console.log(getToken(req, res));
    const github = new GitHub(
        {
            username: getToken(req, res),
            gitRepo: req.body.gitRepo,
            gitUsername: req.body.gitUsername,
            gitPat: req.body.gitPat
        }
    );
    env.gitUsername = req.body.gitUsername;
    env.github_token = req.body.gitPat;
    env.gitRepo = req.body.gitRepo;
    env.cloneOrCreate = "-n";
    env.codeRepo = "";
    // github.save((err, response) => {
    //     if (err) {
    //         res.status(500).send({ message: 'Error saving github repo' })
    //     }
    //     res.status(200).send({ message: 'Git hub saved', data: response })
    // })
    execShellCommand("sh git-repo-create.sh", env).then(shelres => {
        console.log(shelres);
        github.save((err, response) => {
            if (err) {
                res.status(500).send({ message: 'Error saving github repo' })
            }
            res.status(200).send({ message: 'Git hub saved', data: response })
        })
    })

}
exports.getgitrepos = (req, res) => {
    // let token = req.headers["x-access-token"];
    // jwt.verify(token, config.secret, (err, decoded) => {
    //     console.log(decoded);
    // })
    GitHub.find({ username: getToken(req, res) }, (err, github) => {
        if (err) {
            res.status(404).send({ message: "No github repos for user" });
        }
        // console.log(github);
        res.status(200).send({ github });
    })
}
exports.deletegitrepos = (req, res) => {
    GitHub.deleteMany({ username: getToken(req, res) }, (err, github) => {
        if (err) {
            res.status(404).send({ message: "No github repos for user", data: null });
        }
        res.status(200).send({ message: 'Git hub deleted', data: github });
    })
}
exports.deletegitrepo = (req, res) => {
    GitHub.deleteMany({ username: getToken(req, res), _id: req.query.id }, (err, github) => {
        if (err) {
            res.status(404).send({ message: "No github repos for user", data: null });
        }
        res.status(200).send({ message: 'Git hub deleted', data: github });
    })
}
exports.deleteproject = (req, res) => {

    Project.deleteMany({ username: getToken(req, res), _id: req.body.id }, (err, response) => {
        console.log(response);
        if (err) {
            res.status(500).send({ message: 'Something happend while deleting' });
        }
        if (response.deletedCount > 0)
            res.status(200).send({ message: 'Project Deleted' });
        else
            res.status(200).send({ message: 'Could not delete project' });
    })
};
exports.deleteprojects = (req, res) => {

    Project.deleteMany({ username: getToken(req, res) }, (err, response) => {
        console.log(response);
        if (err) {
            res.status(500).send({ message: 'Something happend while deleting' });
        }
        if (response.deletedCount > 0)
            res.status(200).send({ message: 'Projects Deleted' });
        else
            res.status(200).send({ message: 'Could not delete project' });
    })
};
exports.getprojects = (req, res) => {
    Project.find({ username: getToken(req, res) }, (err, projects) => {
        if (err) {
            res.status(404).send({ message: "No projects found for user" });
        }
        res.status(200).send(projects);
    })
}
exports.getproject = (req, res) => {
    Project.find({ username: getToken(req, res), _id: req.query.id }, (err, projects) => {
        if (err) {
            res.status(404).send({ message: "No projects found for user" });
        }
        res.status(200).send(projects);
    })
}

exports.getazstatus = (req, res) => {
    AzureStatus.find({ username: getToken(req, res), projectId: req.query.id }, (err, status) => {
        if (err) {
            res.status(404).send({ message: "No projects found for user" });
        }
        res.status(200).send(status);
    })
}
exports.getprojectbuild = (req, res) => {
    BuildProject.find({ username: getToken(req, res), projectId: req.query.id }, (err, status) => {
        if (err) {
            res.status(404).send({ message: "No projects found for user" });
        }
        res.status(200).send(status);
    })
}
exports.deleteprojectbuild = (req, res) => {
    BuildPipeline.deleteOne({ username: getToken(req, res), projectName: req.body.projectName }, (err, response) => {
        if (err) {
            res.status(404).send({ message: "No projects found for user" });
        }
        res.status(200).send({ message: 'Project Deleted' });
    })
}
exports.startprojectbuild = (req, res) => {
    res.status(200).send({ message: "Started Build" });
    // global.io.emit('buildupdate', { message: 'Fetching resources for project', date: moment().format('LLLL'), status: 'done' });
    Project.find({ username: getToken(req, res), projectName: req.body.projectName, _id: req.body.id }, (err, projectDetails) => {
        if (err) {
            res.status(400).send({ message: 'Project not found' });
        }

        Project.updateMany({ username: getToken(req, res), _id: req.body.id }, { $set: { startedBuild: true } }, (err, updatedProject) => {
            if (err) {
                res.status(400).send({ message: 'Something Happend' });
            }
        })
        // return projectDetails;
        const azStatus = new AzureStatus({
            "login": false,
            "devops": false,
            "build": false,
            "buildvar": false,
            "projectId": req.body.id,
            "username": getToken(req, res),
        });
        azStatus.save((err, res) => {
            if (err) {
                res.status(500).send({ message: 'erro' });
            }
        })
        console.log(projectDetails);
        AzureResource.find({ username: getToken(req, res), resource_group_name: req.body.resourceGroupName }, (err, resources) => {
            if (err) {
                res.status(400).send({ message: "Resource not found" });
            }
            const projectBuild = new BuildProject(
                {
                    projectId: req.body.id,
                    username: getToken(req, res),
                    cloudType: projectDetails[0].cloudType,
                    containerName: resources[0].azure_container_registry_name,
                    resourceGroupName: resources[0].resource_group_name,
                    location: resources[0].location,
                    projectName: projectDetails[0].projectName,
                    projectType: projectDetails[0].projectType,
                    startedBuild: true,
                    finishedBuild: false,
                    gitRepo: ''
                }
            );
            projectBuild.save((err, res) => {
                if (err) {
                    console.log('error')
                }
            })
            env.username = resources[0].azusername;
            env.password = resources[0].azpassword;
            env.organization = resources[0].organization;
            env.projectName = projectDetails[0].projectName;
            env.projectType = projectDetails[0].projectType;
            env.projectDescription = "FirstProject";
            env.pipeline_folder = projectDetails[0].projectName + '- Build Pipline';
            env.pipeline_name = projectDetails[0].projectName + ' Pipeline';
            env.pipeline_description = projectDetails[0].projectDescription;
            env.git_service_connection_name = projectDetails[0]._id + 'GitServiceConnection1';

            env.location = resources[0].location;
            env.resource_group_name = resources[0].resource_group_name;
            env.azure_container_registry_name = resources[0].azure_container_registry_name;
            env.dockerServiceConnection = projectDetails[0].projectName + 'DockerServiceConnection1';
            env.containerRepository = resources[0].containerRepository;
            env.ROLE_ID = "8311e382-0749-4cb8-b61a-304f252e45ec";
            env.anypointUsername = "basil_njclabs";
            env.anypointPassword = "Mule123";
            console.log(env);
            GitHub.find({ username: getToken(req, res) }, (err, gitRes) => {
                if (err) {
                    console.log("Git error")
                }
                console.log(gitRes)
                env.gitUsername = gitRes[0].gitUsername;
                env.github_token = gitRes[0].gitPat;
                env.gitRepo = projectDetails[0].projectName;
                env.cloneOrCreate = "";
                env.projectType = projectDetails[0].projectType;
                var script = "";
                if (projectDetails[0].projectType == 'spring') {
                    env.codeRepo = "https://github.com/bbandroid19/azure-automate";
                    script = "sh git-process-spring.sh"

                } else if (projectDetails[0].projectType == 'react') {
                    env.codeRepo = "https://github.com/bbandroid19/azure-react";
                    script = "sh git-process-react.sh"
                } else {
                    env.codeRepo = "https://github.com/bbandroid19/mule";
                    script = "sh git-process.sh"
                }
                execShellCommand("sh git-repo-create.sh", env).then(res => {
                    global.io.emit('buildupdate', { message: 'Git Repository created', date: moment().format('LLLL'), status: 'done' });
                    env.github_repo_url = 'https://github.com/' + gitRes[0].gitUsername + '/' + projectDetails[0].projectName;
                    env.github_pat = gitRes[0].gitPat;
                    updateGitProject(projectDetails[0]._id, env.github_repo_url)
                    execShellCommand(script, env).then(shelres => {
                        console.log(shelres);

                        global.io.emit('buildupdate', { message: 'Git commit done', date: moment().format('LLLL'), status: 'done' });

                        global.io.emit('buildupdate', { message: 'Azure Login', date: moment().format('LLLL'), status: 'done' });
                        execShellCommand("sh az-login.sh", env).then(result => {
                            // global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                            updateStatus(getToken(req, res), req.body.id, 'login');
                            execShellCommand("sh account-show.sh", env).then(result => {
                                var accountInfo = JSON.parse(result);
                                env.subscriptionId = accountInfo.id;
                                env.tenantId = accountInfo.tenantId;
                                env.subscriptionName = accountInfo.name;
                                // global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                                execShellCommand("sh get-acr-id.sh", env).then(result => {
                                    // res.json(result);
                                    var gacridObj = JSON.parse(result);
                                    env.acr_id = gacridObj.id;
                                    env.acr_server = gacridObj.loginServer;
                                    env.acr_name = gacridObj.name;
                                    global.io.emit('buildupdate', { message: 'Azure Devops: Creating Project', date: moment().format('LLLL'), status: 'progress' });
                                    execShellCommand("sh az-devops-create.sh", env).then(result => {
                                        global.io.emit('buildupdate', { message: 'Azure Devops: Creating Project', date: moment().format('LLLL'), status: 'done' });
                                        // global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                                        // global.io.emit('buildupdate', { message: 'Azure Devops: Creating Project', date: moment().format('LLLL'), status: 'done' });
                                        updateStatus(getToken(req, res), req.body.id, 'devops');
                                        execShellCommand("sh acr-service-connection.sh", env).then(result => {
                                            // global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                                            var acr_service_connectObj = JSON.parse(result)
                                            env.acr_service_id = acr_service_connectObj.id;
                                            console.log("Service id begin ---");
                                            console.log(acr_service_connectObj.id);
                                            console.log("Service id end ---");
                                            execShellCommand("sh git-service-connection.sh", env).then(result => {
                                                global.io.emit('buildupdate', { message: 'Azure Devops: Creating git service connection', date: moment().format('LLLL'), status: 'done' });
                                                // global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                                                var gitscObject = JSON.parse(result);
                                                env.github_service_connection_id = gitscObject.id;
                                                setTimeout(function () {
                                                    execShellCommand("sh acr-service-listing.sh", env).then(result => {
                                                        // global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                                                        console.log("Service id inside listing ---");
                                                        execShellCommand("sh update-acr-allow-all.sh", env).then(result => {
                                                            // global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                                                            console.log(result)
                                                            var scr = ""
                                                            if (projectDetails[0].projectType === 'mule') {
                                                                scr = "sh create-build-variables-mule.sh"
                                                            } else {
                                                                scr = "sh create-build-variables.sh"
                                                            }
                                                            execShellCommand(scr, env).then(result => {
                                                                // global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                                                                updateStatus(getToken(req, res), req.body.id, 'buildvar');
                                                                execShellCommand("sh devops-pipeline-folder-create.sh", env).then(result => {
                                                                    global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                                                                    execShellCommand("sh build-pipeline.sh", env).then(result => {
                                                                        // global.io.emit('buildupdate', { message: result, date: moment().format('LLLL'), status: 'console' });
                                                                        global.io.emit('buildupdate', { message: "Build Pipeline started", date: moment().format('LLLL'), status: 'done' });
                                                                        // res.status(200).send({ message: 'Build Pipeline started', data: result });
                                                                        // checkbuildsucceded();
                                                                        var buildResult = JSON.parse(result);
                                                                        env.buildNumber = buildResult.id;
                                                                        const bdres = new BuildPipeline({
                                                                            username: getToken(req, res),
                                                                            buildId: buildResult.id,
                                                                            buildName: buildResult.definition.name,
                                                                            projectName: projectDetails[0].projectName,
                                                                            projectId: projectDetails[0]._id
                                                                        })
                                                                        console.log(bdres);
                                                                        bdres.save((err, result) => {
                                                                            if (err) {
                                                                                // res.status(500).send({ message: 'Error saving project' });
                                                                            }
                                                                            console.log(result);
                                                                            updateStatus(getToken(req, res), req.body.id, 'build');
                                                                            checkbuild(buildResult.id, resources[0].resource_group_name);


                                                                        })
                                                                        // Project.updateMany({ username: getToken(req, res), _id: req.body.id }, { $set: { finishedBuild: true } }, (err, updatedProject) => {
                                                                        //     if (err) {
                                                                        //         res.status(400).send({ message: 'Something Happend' });
                                                                        //     }
                                                                        // })

                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                }, 30000)
                                            })
                                        })

                                    })
                                })
                            })
                        })

                    })
                })

            })
        })
    })
}

exports.createrelease = (req, res) => {
    console.log(req.body.id);
    Project.find({ username: getToken(req, res), _id: req.body.id }, (err, projectDetails) => {
        if (err) {
            res.status(400).send({ message: 'Project not found' });
            return;
        }
        console.log(projectDetails);
        env.projectName = projectDetails[0].projectName;
        var variables = [];
        global.io.emit('releaseupdate', { message: 'Azure Devops: Getting Build details', date: moment().format('LLLL'), status: 'progress' });
        if (projectDetails[0].projectType === 'mule') {
            execShellCommand('sh get-build-api.sh', env).then(res => {
                global.io.emit('releaseupdate', { message: 'res', date: moment().format('LLLL'), status: 'console' });
                var buildRes = JSON.parse(res);
                env.projectId = buildRes.value[0].definition.project.id;
                env.buildId = buildRes.value[0].id;
                env.buildName = buildRes.value[0].definition.name;
                env.queueId = buildRes.value[0].queue.id;
                global.io.emit('releaseupdate', { message: 'Azure Devops: Creating release variables', date: moment().format('LLLL'), status: 'progress' });
                execShellCommand('sh create-release-variables-mule.sh', env).then(res => {
                    global.io.emit('releaseupdate', { message: res, date: moment().format('LLLL'), status: 'console' });
                    if (res) {
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
                            execShellCommand('sh az-release-variables.sh', env).then(res => {
                            })
                        });
                    }
                })

                setTimeout(() => {
                    execShellCommand('sh get-variable-groups.sh', env).then(res => {
                        if (res) {
                            var variabGroupJsone = JSON.parse(res).value;
                            variabGroupJsone.forEach(element => {
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
                            env.releaseVariables = variables;
                            global.io.emit('releaseupdate', { message: 'Creating Mule credentials', date: moment().format('LLLL'), status: 'progress' });
                            execShellCommand('sh create-mule-cred.sh', env).then(res => {
                                global.io.emit('releaseupdate', { message: res, date: moment().format('LLLL'), status: 'console' });
                                execShellCommand('sh az-upload-credentials.sh', env).then(res => {
                                    if (res) {
                                        var jsonRes = JSON.parse(res);
                                        env.muleSecureFileId = jsonRes.id;
                                        global.io.emit('releaseupdate', { message: 'Creating release definition', date: moment().format('LLLL'), status: 'progress' });
                                        execShellCommand('sh create-release-def.sh', env).then(res => {
                                            global.io.emit('releaseupdate', { message: res, date: moment().format('LLLL'), status: 'console' });
                                            if (res) {
                                                var releaseJson = JSON.parse(res);
                                                env.releaseDefId = releaseJson.id;
                                                global.io.emit('releaseupdate', { message: 'Creating release', date: moment().format('LLLL'), status: 'progress' });
                                                execShellCommand('sh create-release.sh', env).then(res => {
                                                    global.io.emit('releaseupdate', { message: res, date: moment().format('LLLL'), status: 'done' });
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    })

                }, 3000)
            })



        }
    })
}
exports.deployapplication = (req, res) => {
    Project.find({ username: getToken(req, res), projectName: req.body.projectName, _id: req.body.id }, (err, projectDetails) => {
        if (err) {
            res.status(400).send({ message: 'Project not found' });
        }
        // return projectDetails;
        env.projectName = projectDetails[0].projectName;
        console.log(projectDetails);
        AzureResource.find({ username: getToken(req, res), resource_group_name: req.body.resourceGroupName }, (err, resources) => {
            console.log(resources);
            env.azure_container_registry_name = resources[0].azure_container_registry_name;
            env.containerRepository = resources[0].containerRepository;
            // let yamlStr = yaml.safeDump(data);
            // fs.writeFileSync('data-out.yaml', yamlStr, 'utf8');
            env.resource_group_name = resources[0].resource_group_name;
            env.aks_cluster_name = resources[0].aks_cluster_name;
            env.kubectl_secret_name = projectDetails[0]._id + env.aks_cluster_name + Math.random();
            env.kubectl = "az";
            global.io.emit('deployment', { message: "Aks get credentials", date: moment().format('LLLL'), status: 'progress' });
            execShellCommand('sh aks-get-credentials.sh', env).then(result => {
                execShellCommand("sh acr-docker-service-connection.sh", env).then(res => {

                    console.log(res);
                    global.io.emit('deployment', { message: "Creating kubernetes yaml", date: moment().format('LLLL'), status: 'progress' });
                    execShellCommand("sh kube-create-yaml.sh", env).then(res => {
                        console.log(res);
                        console.log('after kubectl secret')
                        let fileContents = fs.readFileSync('./deployment.yaml', 'utf8');
                        let data = yaml.safeLoadAll(fileContents);
                        let nes_data = {
                            imagePullSecrets: [{ name: env.kubectl_secret_name }]
                        }
                        console.log(data)
                        console.log(data);
                        Object.assign(data[0].spec.template.spec, nes_data);
                        let yamlStr = yaml.safeDump(data[0]);
                        fs.writeFileSync('data-out.yaml', yamlStr, 'utf8');
                        global.io.emit('deployment', { message: "Before kubernetes apply", date: moment().format('LLLL'), status: 'progress' });
                        execShellCommand("kubectl apply -f data-out.yaml", env).then(res => {
                            console.log('after kubectl apply')
                            console.log(res);
                            setTimeout(() => {
                                execShellCommand("sh combine-kubectl-files.sh", env).then(result => {
                                    console.log('before kubectl apply')
                                    const interVal = setInterval(() => {
                                        execShellCommand("sh kubectl-get-service.sh", env).then(res => {
                                            var jsonRes = JSON.parse(res);
                                            console.log(jsonRes.status);
                                            if (jsonRes.status && jsonRes.status.loadBalancer && jsonRes.status.loadBalancer.ingress.length) {
                                                clearInterval(interVal);
                                                console.log(jsonRes.status.loadBalancer && jsonRes.status.loadBalancer.ingress[0].ip);
                                                global.io.emit('deployment', { message: jsonRes.status.loadBalancer.ingress[0].ip, date: moment().format('LLLL'), status: 'done' });
                                            }
                                        })
                                    }, 2000)

                                })
                            }, 5000)

                        })

                    })

                })
            })

        });
    })
}

exports.checkbuildsucceded = (req, res) => {
    BuildPipeline.find({ projectId: req.body.id, projectName: req.body.projectName }, (err, buildResponse) => {
        if (err) {
            res.status(400).send({ message: 'Project not found' });
        }
        console.log(buildResponse);
        // res.status(200).send(buildResponse);
        if (buildResponse && buildResponse.length) {
            env.build_id = buildResponse[0].buildId;
            execShellCommand("sh check-pipeline.sh", env).then(result => {
                var buildResult = JSON.parse(result);
                res.status(200).send({ message: buildResult.status });

            })
        }

    })

}
exports.checkbuildstarted = (req, res) => {
    env.projectName = req.query.projectName;
    env.organization = organization;
    console.log(req.query.projectName)
    execShellCommand("sh pipeline-list.sh", env).then(response => {
        var jsonObj = JSON.parse(response);
        console.log(jsonObj);
        if (jsonObj.length) {
            checkbuild(jsonObj[0].id);
            res.status(200).send({ message: 'Build Exists' });
        } else {
            res.status(200).send({ message: 'No Build' });
        }
    })
}
exports.getbuildpipelines = (req, res) => {
    BuildPipeline.find({ username: getToken(req, res), projectId: req.body.id }, (err, buildResponse) => {
        if (err) {
            res.status(400).send({ message: 'Project not found' });
        }
        res.status(200).send(buildResponse)
    })
}