
# az login -u${username} -p ${password} 

az login --service-principal --username ${azusername} --password ${azpassword} --tenant ${aztenantid}

az group create --name ${resource_group_name} --location ${location}

az acr create --resource-group ${resource_group_name} --name ${azure_container_registry_name} --sku Basic 

az aks create --resource-group ${resource_group_name}  --name ${aks_cluster_name} --service-principal ${azusername} --client-secret ${azpassword} --node-count 1 --enable-addons monitoring --generate-ssh-keys

az logout