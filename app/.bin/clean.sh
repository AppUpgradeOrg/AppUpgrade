pwd
rm -rf node_modules
rm -f tsconfig.tsbuildinfo

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

cd ..