#!/usr/bin/env bash
set -e

echo "====> deploying to github"

rm -f books/tour/.gitignore
git checkout -b tmp/gh-pages
git add -A
git commit -m "deployed on $(date) by ${USER}"
#git push origin tmp/gh-pages:gh-pages --force
git push https://mia-entropy:$GITHUB_TOKEN@github.com/mia-entropy/eberban.git tmp/gh-pages:gh-pages
