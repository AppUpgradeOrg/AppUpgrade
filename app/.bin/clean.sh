app-upgrade # Go to home folder
cd app

rm -rf node_modules
rm -f tsconfig.tsbuildinfo
rm -rf functions-build
rm -rf dist

cd common
rm -rf node_modules
rm -rf dist
rm -f tsconfig.tsbuildinfo

cd ../functions
rm -rf node_modules
rm -rf dist
rm -f tsconfig.tsbuildinfo

cd ../scripts
rm -rf node_modules
rm -rf dist
rm -f tsconfig.tsbuildinfo

cd ../app-upgrade-client
rm -rf node_modules
rm -rf dist
rm -f tsconfig.tsbuildinfo

cd ../app-upgrade-client
rm -rf node_modules
rm -rf dist
rm -f tsconfig.tsbuildinfo

cd ../build-scripts
rm -rf node_modules