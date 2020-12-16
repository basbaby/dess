#!/bin/bash
az login --service-principal --username ${azusername} --password ${azpassword} --tenant ${aztenantid}
az aks get-credentials --resource-group ${resource_group_name}  --name ${aks_cluster_name} --overwrite-existing -f ./kubet/config
# kubectl --context ${aks_cluster_name} version -v=8