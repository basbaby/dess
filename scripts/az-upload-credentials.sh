#!/bin/bash
curl --location --request POST "https://dev.azure.com/${orgName}/${projectName}/_apis/distributedtask/securefiles?api-version=5.0-preview.1&name=credentials" \
--header 'Content-Type: application/octet-stream' \
--header "Authorization: Basic ${curlToken}"  \
--data-binary 'credentials'