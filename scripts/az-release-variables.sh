#!/bin/bash
xport AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
az pipelines variable-group create --name release.${muleEnv} --authorize true --description "Release variables" --org "https://dev.azure.com/njclabstestac" --project "${projectName}"  --variables APP_NAME=${mulAppName} CLIENT_ID=${muleClientId}  CLIENT_SECRET=${muleClientSecret} ENV=${muleEnv}

# curl --location --request POST "https://dev.azure.com/njclabstestac/${projectName}/_apis/distributedtask/variablegroups?api-version=6.0-preview.2" \
# --header 'Content-Type: application/json' \
# --header 'Authorization: Basic bmpjbGFicy50ZXN0YWNAZ21haWwuY29tOnRubXlyanc3eWN6ZTVzeWZhNDZ4ZXIzcGk2Z2NuYnd3NmlzanltNWo0djNyd2RnbGd5NHE=' \
# --data-raw '{"description":"","name":"'${muleEnv}'.release","providerData":null,"type":"Vsts","variables":{"APP_NAME":{"isSecret":false,"value":"'${mulAppName}'"},"CLIENT_ID":{"isSecret":false,"value":"'${muleClientId}'"},"CLIENT_SECRET":{"isSecret":false,"value":"'${muleClientSecret}'"},"ENV":{"isSecret":false,"value":"'${muleEnv}'"},"variableGroupProjectReferences":[{"description":"release","name":"'${muleEnv}'.release","projectReference":{"id":"'${projectId}'","name":""}}]}}'