export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
az devops service-endpoint update --id ${github_service_connection_id}  --enable-for-all --project "${projectName}" --organization "${organization}"

echo az devops service-endpoint update --id ${acr_service_id}  --enable-for-all --project "${projectName}" --organization "${organization}"

az devops service-endpoint update --id ${acr_service_id}  --enable-for-all --project "${projectName}" --organization "${organization}"