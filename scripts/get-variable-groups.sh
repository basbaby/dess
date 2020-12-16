curl --location --request GET "https://dev.azure.com/${orgName}/${projectName}/_apis/distributedtask/variablegroups?api-version=6.0-preview.2" \
--header 'Content-Type: application/json' \
--header "Authorization: Basic ${curlToken}"