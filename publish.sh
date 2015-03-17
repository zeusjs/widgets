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
cd ..
rm -rf .travis_build || exit 0;
mkdir .travis_build
cd .travis_build
git clone "https://${GH_TOKEN}@${GH_REF}"
git config user.name "ZeusJS Build Bot"
git config user.email "zeusjs.bot@gmail.com"
cd widgets
npm install --quiet -g grunt-cli karma
npm install
grunt build
git commit dist -m "Publish latest build artifacts"
git push "https://${GH_TOKEN}@${GH_REF}" > /dev/null 2>&1
