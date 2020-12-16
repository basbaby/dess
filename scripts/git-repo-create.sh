#!/bin/bash

#####################################################
# Author: Basil Baby , 2020
#####################################################

    ### parse args
    # 1. Git or Bitbucket
    # 2. Username
    # 3. NEW_REPO_NAME
    # 4. private = true/false
    # 5. push

    server=${gitType}
    user=${gitUsername}
    repo=${gitRepo}
    new=${cloneOrCreate}
    repotoClone=${codeRepo}

    ### github logic branch
    ### authentication via PAT

    if [ "$server" = "github" ]
    then
        curl  -H "Authorization: token ${gitPat}" \
            -d '{ "name": "'"$repo"'" ,
                "private": false
            }' \
            https://api.github.com/user/repos
    elif [ "$server" = "azure" ] 
    then
        echo "azure"
        curl --location --request POST "https://dev.azure.com/${orgName}/_apis/git/repositories?api-version=6.0"  \
            --header 'Content-Type: application/json' \
            --header "Authorization: Basic ${azureToken}" \
            --data-raw '{ 
                "name": "'"${projectName}"'",
                "project": {
                    "id": "'"${projectId}"'"
                }
                }'
    else
        echo "\n invalid server argument" ; sleep 2 ; (exit 1)
    fi
