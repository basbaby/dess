#!/bin/bash
export AZURE_DEVOPS_EXT_PAT=${azDevopsPat}
az devops service-endpoint list --project "${projectName}" --subscription "${subscriptionName}" --organization "${organization}"