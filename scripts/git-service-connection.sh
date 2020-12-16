export AZURE_DEVOPS_EXT_GITHUB_PAT=${gitPat}
export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
az devops service-endpoint github create --github-url ${github_repo_url} --project "${projectName}" --org ${organization} --name "${git_service_connection_name}" --output json