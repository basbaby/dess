#!/bin/bash
az login --service-principal --username ${azusername} --password ${azpassword} --tenant ${aztenantid}
az account show