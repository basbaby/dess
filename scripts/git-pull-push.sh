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
    projectType=${projectType}
    projectArchetype=${projectArchetype}
    ### github logic branch
    ### authentication via PAT
    

    if [ "$projectType" = "spring" ]
    then
        cd apiops-project-template
        cd spring-project
    elif [ "$projectType" = "mule" ]
    then
        echo mule
        cd $projectArchetype
        cp /deployment/config/mule/azure-pipelines.yml .
    elif [ "$projectType" = "react" ]
    then
        echo react
        cd apiops-project-template
        cd react-project;
    fi   
    rm -rf .git
    if [ "$server" = "github" ]
    then
        git init ; echo "exit code: ${?}"
        git remote add origin https://$user:${gitPat}@github.com/$user/$repo.git ; echo "exit code: ${?}"
        git add . ; echo "exit code: ${?}"; echo "exit code: ${?}"
        git config  user.email "basilbabysmailbox@gmail.com"; echo "exit code: ${?}"
        git config  user.name "basbaby"; echo "exit code: ${?}"
        git commit -m 'Initial Commit' ; echo "exit code: ${?}"
        git push -f https://$user:${gitPat}@github.com/$user/$repo.git ; echo "exit code: ${?}"
    elif [ "$server" = "azure" ]
    then
        git init ; echo "exit code: ${?}"
        git remote add origin https://${orgName}:${azDevopsPat}@dev.azure.com/${orgName}/$repo/_git/$repo; echo "exit code: ${?}"
        git add . ; echo "exit code: ${?}"
        git config  user.email "basilbabysmailbox@gmail.com"; echo "exit code: ${?}"
        git config  user.name "basbaby"; echo "exit code: ${?}"
        git commit -m 'Initial Commit'; echo "exit code: ${?}"
        git push https://${orgName}:${azDevopsPat}@dev.azure.com/${orgName}/$repo/_git/$repo; echo "exit code: ${?}"
    fi
    cd ..
    cd ..
    rm -rf apiops-project-template