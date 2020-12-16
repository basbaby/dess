#!/bin/bash
# acr_config = "{ authorization: { scheme: \"ServicePrincipal\", parameters: { loginServer: \"${acr_server}\", role:  \"${ROLE_ID}\", scope: \"${acr_id}\", servicePrincipalId: \"<placeholder>\", tenantId:  \"${tenantId}\" } }, data: { appObjectId: \"\", azureSpnPermissions: \"\", azureSpnRoleAssignmentId: \"\", registryId: \"${acr_id}\", registrytype: \"ACR\", spnObjectId: \"\", subscriptionId: \"${subscriptionId}\", subscriptionName: \"${subscriptionName}\" }, description: \"\", groupScopeId: null, name: \"lasttry1\", operationStatus: null, readersGroup: null, serviceEndpointProjectReferences: null, type: \"dockerregistry\", url: \"https://\"${acr_name}\".azurecr.io\", isShared: false, owner: \"library\" }"
# echo "{ \"authorization\": { \"scheme\": \"ServicePrincipal\", \"parameters\": { \"loginServer\": \"${acr_server}\", \"role\":  \"${ROLE_ID}\", \"scope\": \"${acr_id}\", \"servicePrincipalId\": \"<placeholder>\", \"tenantId\":  \"${tenantId}\" } }, \"data\": { \"appObjectId\": \"\", \"azureSpnPermissions\": \"\", \"azureSpnRoleAssignmentId\": \"\", \"registryId\": \"${acr_id}\", \"registrytype\": \"ACR\", \"spnObjectId\": \"\", \"subscriptionId\": \"${subscriptionId}\", \"subscriptionName\": \"${subscriptionName}\" }, \"description\": \"\", \"groupScopeId\": null, \"name\": \"${dockerServiceConnection}\", \"operationStatus\": null, \"readersGroup\": null, \"serviceEndpointProjectReferences\": null, \"type\": \"dockerregistry\", \"url\": \"https://${acr_name}.azurecr.io\", \"isShared\": false, \"owner\": \"library\" }" > acr-config-new.json
# export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
# az devops service-endpoint create --service-endpoint acr-config-new.json --organization "${organization}" --project "${projectName}" --output json

curl --location --request POST "https://dev.azure.com/${orgName}/${projectName}/_apis/serviceendpoint/endpoints?api-version=6.0-preview.4" \
--header 'Content-Type: application/json' \
--header "Authorization: Basic ${azureToken}"  \
--data-raw '{
"administratorsGroup":null,
"authorization":
{
    "scheme":"ServicePrincipal",
    "parameters": {
        "tenantid": "'${tenantId}'",
        "serviceprincipalid": "'${azusername}'",
        "authenticationType": "spnKey",
        "serviceprincipalkey": "'${azpassword}'"
    }
},
"createdBy":null,
"data":
{
    "appObjectId":"",
    "azureSpnPermissions":"",
    "azureSpnRoleAssignmentId":"",
    "registryId":"'${acr_id}'",
    "registrytype":"ACR",
    "spnObjectId":"",
    "subscriptionId":"'${subscriptionId}'"
    "subscriptionName":""
},
"description":"",
"groupScopeId":null,
"name":"'${dockerServiceConnection}'",
"operationStatus":null,
"readersGroup":null,
"serviceEndpointProjectReferences":[
    {
        "description":"",
        "name":"'${dockerServiceConnection}'",
        "projectReference":
        {
            "id":"'${projectId}'",
            "name":"'${projectName}'"
        }
    }
],
"type":"dockerregistry",
"url":"https://'${acr_name}'.azurecr.io",
"isShared":false,
"owner":"library"
}'