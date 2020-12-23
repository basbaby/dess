curl \
  -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token ${gitPat}" \
  https://api.github.com/repos/${gitUsername}/${projectName}/hooks \
  -d '{"config":{"url":"'"${jenkinsServer}/"'github-webhook/","content_type":"application/json","secret":"","insecure_ssl":"","token":"","digest":""}}'