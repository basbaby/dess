# echo --- >> data-out.yaml
kubectl --context ${aks_cluster_name} expose deployment "${projectName}" --type=LoadBalancer --name="${projectName}" --port=8080 --kubeconfig kubet/config