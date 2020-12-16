#!/bin/bash
echo ${azure_container_registry_name}
az acr create --resource-group ${resource_group_name} --name ${azure_container_registry_name} --sku Basic 