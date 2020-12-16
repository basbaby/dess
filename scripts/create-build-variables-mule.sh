export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
az pipelines variable-group create --name build.variables --authorize true --description "Build & Deploy variables" --org ${organization}  --project "${projectName}"  --variables anypointUsername=${anypointUsername} anypointPassword=${anypointPassword}     
 