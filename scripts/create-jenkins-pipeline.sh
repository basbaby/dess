# jenkinsServer="http://104.248.169.167:8080"
# jenkinsUserName="njclabs"
# jenkinsToken="1102645519f124aa3dcd31ed56ac393c8b"
curl -s -XPOST "${jenkinsServer}/createItem?name=${projectName}" -u ${jenkinsUsername}:${jenkinsToken} --data-binary @jenkins-config.xml -H "Content-Type:text/xml"

curl  ${jenkinsServer}/jenkins/git/notifyCommit?url=${github_repo_url}?token=${gitPat}

rm -r jenkins-config.xml