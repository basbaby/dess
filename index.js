const { exec } = require("child_process");
var env = Object.create(process.env);
env.username = "manuthomas314@gmail.com";
 env.password = "Harrier1406";
env.organization = "https://dev.azure.com/manuthomas314";
env.projectName = "new";
env.projectDescription = "Description";
env.pipeline_folder = "build-pipleine";
env.pipeline_name = "Build pipleine";
env.pipeline_description = "Pipeline for spring project";
env.git_service_connection_name = "git-service-connection";
env.github_repo_url = 'https://github.com/bbandroid19/azure-automate';
env.github_pat = '939b8c50f738e06571659a5b1f8d0aaf172d7627';
env.location = "eastus";
env.resource_group_name = "njc-resource-group"
env.azure_container_registry_name = "njclabscontainerregistry1234221";
env.dockerServiceConnection = "njcDockerServiceConnection12423212";
env.containerRepository = "njc-container";
env.ROLE_ID = "8311e382-0749-4cb8-b61a-304f252e45ec";

var az_login = exec("sh az-login.sh", { env: env }, (error, stdout, stderr) => {
    console.log(error);
    exec("sh account-show.sh", { env: env }, (std_acc_err, std_acc_out, std_acc_errObj) => {
        console.log(std_acc_err);
        var accountInfo = JSON.parse(std_acc_out);
        env.subscriptionId = accountInfo.id;
        env.tenantId = accountInfo.tenantId;
        env.subscriptionName = accountInfo.name;
    })
    exec("sh rg-create.sh", { env: env }, (sd_rgc_err, std_rgc_out, std_rgc_errObj) => {
        exec("sh acr-create.sh", { env: env }, (std_acr_err, std_acr_out, std_acr_errObj) => {
            console.log(std_acr_err);
            exec("sh get-acr-id.sh", { env: env }, (std_gacrid_err, std_gacrid_out, std_gacriderrObj) => {
                console.log(std_gacrid_err)
                var gacridObj = JSON.parse(std_gacrid_out);
                env.acr_id = gacridObj.id;
                env.acr_server = gacridObj.loginServer;
                env.acr_name = gacridObj.name;
                exec("sh az-devops-create.sh", { env: env }, (devopsErr, devopsOut, dvpsErr) => {
                    console.log(devopsOut);
                    console.log(devopsErr);
                    exec("sh acr-service-connection.sh", { env: env }, (std_acrsc_err, std_acrsc_out, std_acrsc_errObj) => {
                        console.log(std_acrsc_err);
                        console.log(std_acrsc_out);
                        var acr_service_connectObj = JSON.parse(std_acrsc_out)
                        env.acr_service_id = acr_service_connectObj.id;
                        console.log("Service id begin ---");
                        console.log(acr_service_connectObj.id);
                        console.log("Service id end ---");
                        exec("sh git-service-connection.sh", { env: env }, (gitscErr, gitScOut, gtscErr) => {
                            console.log(gitScOut);
                            var gitscObject = JSON.parse(gitScOut);
                            env.github_service_connection_id = gitscObject.id;
                            if (gitscErr !== null) {
                                console.log(`exec error: ${gtscErr}`);
                            }
                            console.log(gitscErr);
                            setTimeout(function() {
                                exec("sh acr-service-listing.sh", { env: env }, (std_acr_list_err, std_acr_list_out, std_acr_list_errObj) => {
                                    console.log(std_acr_list_err);
                                    console.log(std_acr_list_out);
                                    console.log("Service id inside listing ---");
                                    console.log(env.acr_service_id);
                                    console.log("Service id listing ---");
                                    exec("sh update-acr-allow-all.sh", { env: env }, (std_uacr_err, std_uacr_out, std_uacr_errObj) => {
                                        console.log(std_uacr_err)
                                        exec("sh create-build-variables.sh", { env: env }, (std_bv_err, std_bv_out, std_bgg_errobject) => {
                                            console.log(std_bv_err);
                                            exec("sh build-pipeline.sh", { env: env }, (std_bperr, std_bp_out, std_bperr_obj) => {
                                                console.log(std_bperr);
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
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
        console.log(`exec error: ${error}`);
    }
});