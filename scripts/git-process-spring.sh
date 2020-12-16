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
    ### github logic branch
    ### authentication via PAT

    git clone https://basbaby:0e1ccaff85736279b4f3cafc075dfbd1bc5ea507@github.com/njclabs/apiops-project-template.git
    cd apiops-project-template
    cd spring-project
    rm -rf .git
    if [ "$server" = "github" ]
    then
        git init
        git remote add origin https://$user:${gitPat}@github.com/$user/$repo.git
        git add .
        git commit -m 'Initial Commit'
        git push -u -f origin master
    elif [ "$server" = "azure" ]
    then
        git init 
        git remote add origin https://${orgName}:${azDevopsPat}@dev.azure.com/${orgName}/$repo/_git/$repo
        git add .
        git commit -m 'Initial Commit'
        git push -u -f origin master
    fi
    cd ..
    cd ..
    rm -rf apiops-project-template