#!/usr/bin/env bash
set -e

echo "====> deploying to github"

rm -f books/tour/.gitignore
git checkout -b gh-pages/tmp
git add -A
git commit -m "deployed on $(shell date) by ${USER}"
git push origin gh-pages --force
