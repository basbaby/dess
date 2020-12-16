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
    rm -rf apiops-project-template
    if [ "$projectType" = "mule" ]
    then
        git clone https://basbaby:c0d4189d3aa80479a5d46b0edd42aecc3dda7640@github.com/njclabs/apiops-devops-automation-framework.git
    else
        git clone https://basbaby:c0d4189d3aa80479a5d46b0edd42aecc3dda7640@github.com/njclabs/apiops-project-template.git
    fi    

    
    
