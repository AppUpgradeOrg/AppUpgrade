app-upgrade
cd app

cd common
yarn build

cd ../functions
yarn build

cd ../app-upgrade-client
yarn build

cd ../scripts
yarn build