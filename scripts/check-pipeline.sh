#!/bin/bash
export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
az pipelines build show --id ${build_id} --org ${organization} --project ${projectName}