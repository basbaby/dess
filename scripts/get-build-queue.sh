export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
az pipelines queue list --project ${projectName} --organization ${organization} --queue-name *ubuntu*