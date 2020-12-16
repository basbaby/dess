echo ${aks_cluster_name}
echo ${projectName}
echo ${azure_container_registry_name}.azurecr.io/${containerRepository}:${projectName} 

kubectl --context ${aks_cluster_name}  create deployment "${projectName}" --image=${azure_container_registry_name}.azurecr.io/${containerRepository}:${projectName} --kubeconfig kubet/config --dry-run=client -o=yaml  > deployment.yaml
# echo --- >> deployment.yaml
# kubectl --context ${aks_cluster_name} create service clusterip "${projectName}" --tcp=8080:8080 --kubeconfig kubet/config --dry-run=client -o=yaml >> deployment.yaml