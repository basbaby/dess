#!/bin/bash
az aks create --resource-group ${resource_group_name}  --name ${aks_cluster_name}  --node-count 1 --enable-addons monitoring --generate-ssh-keys