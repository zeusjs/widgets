#!/bin/bash
rm -rf publish_docs || exit 0;
mkdir publish_docs
cp -R docs/* publish_docs
cd publish_docs
git init
git config user.name "ZeusJS Build Bot"
git config user.email "zeusjs.bot@gmail.com"
git add .
git commit -m "Deployed to Github Pages"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
