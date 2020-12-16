var releaseEnv =
{
    "id": 0,
    "name": "",
    "variables": {},
    "rank": 1,
    "variableGroups": [],
    "preDeployApprovals": {
        "approvals": [
            {
                "rank": 1,
                "isAutomated": true,
                "isNotificationOn": false,
                "approver": null,
                "id": 0
            }
        ]
    },
    "postDeployApprovals": {
        "approvals": [
            {
                "rank": 1,
                "isAutomated": true,
                "isNotificationOn": false,
                "id": 0
            }
        ]
    },
    "deployPhases": [
        {
            "deploymentInput": {
                "parallelExecution": {
                    "parallelExecutionType": "none"
                },
                "agentSpecification": {
                    "identifier": "ubuntu-20.04"
                },
                "skipArtifactsDownload": false,
                "artifactsDownloadInput": {
                    "downloadInputs": []
                },
                "queueId": '${queueId}',
                "demands": [],
                "enableAccessToken": false,
                "timeoutInMinutes": 0,
                "jobCancelTimeoutInMinutes": 1,
                "condition": "succeeded()",
                "overrideInputs": {}
            },
            "rank": 1,
            "phaseType": "agentBasedDeployment",
            "name": "Agent job",
            "refName": null,
            "workflowTasks": [
                {
                    "environment": {},
                    "taskId": "2a6ca863-f2ce-4f4d-8bcb-15e64608ec4b",
                    "version": "1.*",
                    "name": "Credentials",
                    "refName": "",
                    "enabled": true,
                    "alwaysRun": false,
                    "continueOnError": false,
                    "timeoutInMinutes": 0,
                    "definitionType": "task",
                    "overrideInputs": {},
                    "condition": "succeeded()",
                    "inputs": {
                        "secureFile": "'${muleSecureFileId}'",
                        "retryCount": "5"
                    }
                },
                {
                    "environment": {},
                    "taskId": "6c731c3c-3c68-459a-a5c9-bde6e6595b5b",
                    "version": "3.*",
                    "name": "Deploy to Sandbox",
                    "refName": "",
                    "enabled": true,
                    "alwaysRun": false,
                    "continueOnError": false,
                    "timeoutInMinutes": 0,
                    "definitionType": "task",
                    "overrideInputs": {},
                    "condition": "succeeded()",
                    "inputs": {
                        "targetType": "inline",
                        "filePath": "",
                        "arguments": "",
                        "script": "# Write your commands here\n\n sudo npm install -g anypoint-cli@latest\nmkdir ~/.anypoint\ncp $AGENT_TEMPDIRECTORY/credentials ~/.anypoint/\n\nexport ANYPOINT_PROFILE=$(ENV)\n\necho $(FILENAME)\nRUNTIME_TASK=deploy\n\nif anypoint-cli runtime-mgr cloudhub-application describe $(APP_NAME) ; then\n    echo \"Application exist\"\n    RUNTIME_TASK=modify\nelse\n    echo \"Application doesn'\''t exist\"\nfi\n\nanypoint-cli runtime-mgr cloudhub-application $RUNTIME_TASK --runtime \"$(RUNTIME)\" --workers \"$(WORKERS)\" --workerSize \"$(WORKER_SIZE)\" --region \"$(REGION)\" --property \"env:$(ENV)\"  --property \"anypoint.platform.platform_base_uri:$(PLATFORM)\" --property \"anypoint.platform.client_id:$(CLIENT_ID)\" --property \"anypoint.platform.client_secret:$(CLIENT_SECRET)\" $(APP_NAME) $(FILENAME)\n",
                        "workingDirectory": "",
                        "failOnStderr": "false",
                        "noProfile": "true",
                        "noRc": "true"
                    }
                }
            ]
        }
    ],
    "environmentOptions": {
        "emailNotificationType": "OnlyOnFailure",
        "emailRecipients": "release.environment.owner;release.creator",
        "skipArtifactsDownload": false,
        "timeoutInMinutes": 0,
        "enableAccessToken": false,
        "publishDeploymentStatus": false,
        "badgeEnabled": false,
        "autoLinkWorkItems": false,
        "pullRequestDeploymentEnabled": false
    },
    "demands": [],
    "conditions": [
        {
            "name": "ReleaseStarted",
            "conditionType": "event",
            "value": ""
        }
    ],
    "executionPolicy": {
        "concurrencyCount": 0,
        "queueDepthCount": 0
    },
    "schedules": [],
    "retentionPolicy": {
        "daysToKeep": 30,
        "releasesToKeep": 3,
        "retainBuild": true
    },
    "properties": {},
    "preDeploymentGates": {
        "id": 0,
        "gatesOptions": null,
        "gates": []
    },
    "postDeploymentGates": {
        "id": 0,
        "gatesOptions": null,
        "gates": []
    },
    "environmentTriggers": []
}
