#!/bin/bash

# az login --service-principal --username 1044ff88-c944-49a5-979c-f6737bd55042 --password 65dcc99a-bba4-41f3-94e3-eb6e6f19ef04  --tenant 9f0b2463-0d63-4ac2-b62e-d2415ce0780b

az extension add --name azure-devops

# az devops configure --defaults organization=https://dev.azure.com/meera46 project=newproject

az login --service-principal --username 1044ff88-c944-49a5-979c-f6737bd55042 --password 65dcc99a-bba4-41f3-94e3-eb6e6f19ef04  --tenant 9f0b2463-0d63-4ac2-b62e-d2415ce0780b
az ad user create --user-principal-name basbaby23@meera46gmail.onmicrosoft.com --display-name basbbay --password April2019$

az devops configure --defaults organization="https://dev.azure.com/basbaby23" project=newproject

az logout

az login -u basbaby23@meera46gmail.onmicrosoft.com -p April2019$ 

az devops project create --name sample -d "Description" -s git --visibility private

cd build/jsQuizEngine

az pipelines create --name "Build" --description "Pipeline for CLI project" --repository CLISample 


# # Create a resource group.
# az group create --location centralus --name njc-lms-new-rg1

# # Create an App Service plan in `FREE` tier.
# az appservice plan create --name $webappname --resource-group njc-lms-new-rg1 --sku FREE

# # Create a web app.
# az webapp create --name $webappname --resource-group njc-lms-new-rg1 --plan $webappname

# # Deploy code from a public GitHub repository. 
# az webapp deployment source config --name $webappname --resource-group njc-lms-new-rg1 \
# --repo-url $gitrepo --branch master --manual-integration

# Copy the result of the following command into a browser to see the web app.
echo http://$webappname.azurewebsites.net