#!/bin/bash
export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
az devops project create --name "${projectName}" -d "${projectDescription}" -s git --visibility public --organization ${organization}