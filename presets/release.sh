cp package.json dist
cd dist

npm link
npm publish

cd ../

git add ./package.json
git commit -m "chore(presets): update version"