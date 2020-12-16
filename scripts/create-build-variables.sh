export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
if [ "${projectType}" = "mule" ]
then
    az pipelines variable-group create --name build.variables --authorize true --description "Build & Deploy variables" --org ${organization}  --project "${projectName}"  --variables anypointUsername=${anypointUsername} anypointPassword=${anypointPassword}     
else
    az pipelines variable-group create --name build.variables --authorize true --description "Build variables" --org ${organization}  --project "${projectName}"  --variables dockerRegistryServiceConnection=${dockerServiceConnection} imageRepository=${containerRepository}  dockerTag=${projectName}
fi    