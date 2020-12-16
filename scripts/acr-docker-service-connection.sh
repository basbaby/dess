#!/bin/bash
kubectl --context ${aks_cluster_name} create secret docker-registry "${kubectl_secret_name}"  --docker-server="${azure_container_registry_name}".azurecr.io  --docker-username="${azusername}"  --docker-password="${azpassword}" --kubeconfig kubet/config
