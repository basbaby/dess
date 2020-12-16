#!/bin/bash
export AZURE_DEVOPS_EXT_GITHUB_PAT=${github_pat}
export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}

if [ "${gitType}" = "github" ]
then
    echo "Git service connection Id"
    echo ${github_service_connection_id}
    # echo az pipelines create  --name "${pipeline_name}" --description "${pipeline_description}" --repository "${github_repo_url}" --branch master --org $organization --project "${projectName}" --yml-path azure-pipelines.yml --service-connection ${github_service_connection_id}
    az pipelines create  --name "${pipeline_name}" --description "${pipeline_description}" --repository "${github_repo_url}" --branch master --org $organization --project "${projectName}" --yml-path azure-pipelines.yml --service-connection ${github_service_connection_id}
elif [ "${gitType}" = "azure" ]
then
    az pipelines create  --name "${pipeline_name}" --description "${pipeline_description}" --repository "${projectName}" --branch master --org $organization --project "${projectName}" --yml-path azure-pipelines.yml --repository-type tfsgit
fi