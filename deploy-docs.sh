#!/usr/bin/env sh

set -e

npm run docs:build

cp docs/favicon.ico docs/.vitepress/dist 
cp docs/logo.png docs/.vitepress/dist 
cd docs/.vitepress/dist

rm -rf .git
git init
git config user.name okiss 
git config user.email okissjs@gmail.com
git add -A
git commit -m 'deploy-docs'

git push -f git@github.com:daodao97/oms.git master:gh-pages

cd -
