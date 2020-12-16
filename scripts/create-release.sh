curl --location --request POST "https://vsrm.dev.azure.com/${orgName}/${projectName}/_apis/release/releases?api-version=6.0" \
--header 'Content-Type: application/json' \
--header "Authorization: Basic ${curlToken}" \
--data-raw '{
  "definitionId": '${releaseDefId}',
  "description": "Creating First release",
  "artifacts": [
    {
      "alias": "_'${projectName}' Pipeline",
      "instanceReference": {
        "id": "'${buildId}'",
        "name": "'${projectName}' Pipeline"
      }
    }
  ],
  "isDraft": false,
  "reason": "none",
  "manualEnvironments": null
}'