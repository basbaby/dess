az devops configure --defaults organization=${organization} project=${projectName}


az pipelines folder create --path "${pipeline_folder}" --project ${projectName} --org ${organization}