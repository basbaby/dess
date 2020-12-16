#!/usr/bin/env bash
TOKEN=${git_user_token}

if [[ $# < 3 ]]; then
    echo "arguments: $0 <RepoName> <RepoDescription>"
    exit 1
fi

REPO_NAME=$1; shift
REPO_DESCRIPTION="$@"

echo "Name: $REPO_NAME"
echo "Description: $REPO_DESCRIPTION"
echo "Calling GitHub to create repo"

read -r -d '' PAYLOAD <<EOP
{
  "name": "$REPO_NAME",
  "description": "$REPO_DESCRIPTION",
  "homepage": "https://github.com/$REPO_NAME",
  "private": false
}
EOP

shopt -s lastpipe
curl -H "Authorization: token $TOKEN" --data "$PAYLOAD" \
    https://api.github.com/user/repos | readarray output

url=''
for line in "${output[@]}"; do
    echo -n "$line"
    #   "html_url": "https://github.com/sfinktah/vim-hex-sum",
    if [[ $line == *html_url* ]]; then
        l=${line#*\"}; l=${l#*\"}; l=${l#*\"}; url=${l%\"*}
    fi
done

count=0
[[ $url == http*://*github.com/* ]] &&
    until git clone $url; do 
        sleep 10; (( count++ > 5 )) && break; echo Waiting...
    done