var releaseDef = {
    "source": "undefined",
    "revision": 1,
    "description": null,
    "createdBy": null,
    "createdOn": "0001-01-01T00:00:00",
    "modifiedBy": null,
    "modifiedOn": "0001-01-01T00:00:00",
    "isDeleted": false,
    "variables": {},
    "variableGroups": ['${releaseVariableId}'],
    "environments": [],
    "artifacts": [
        {
            "alias": "_'${projectName}' Pipeline",
            "definitionReference": {
                "defaultVersionBranch": {
                    "id": "", "name": ""
                },
                "defaultVersionSpecific": {
                    "id": "", "name": ""
                },
                "defaultVersionTags": {
                    "id": "", "name": ""
                }, "defaultVersionType": {
                    "id": "latestType",
                    "name": "Latest"
                }, "definition": {
                    "id": "'${buildDefId}'",
                    "name": "'${projectName}' Pipeline"
                }, "definitions": {
                    "id": "", "name": ""
                }, "IsMultiDefinitionType": {
                    "id": "False", "name": "False"
                }, "project": {
                    "id": "'${projectId}'",
                    "name": "'${projectName}'"
                }, "repository": {
                    "id": "",
                    "name": ""
                }
            },
            "isPrimary": true,
            "isRetained": false,
            "sourceId": "'${projectId}':'${buildId}'",
            "type": "Build"

        }
    ],
    "triggers": [
        {
            "artifactAlias": "_'${projectName}' Pipeline",
            "triggerConditions": null,
            "triggerType": 1
        }
    ],
    "releaseNameFormat": null,
    "tags": [],
    "properties": {},
    "id": 0,
    "name": "'${projectName}' Release",
    "projectReference": null,
    "_links": {}
}
module.exports = releaseDef;