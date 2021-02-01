const shell = require('shelljs');
const path = require('path');
const { existsSync } = require('fs');

/// Assert invariants

/// Ensure APP_UPGRADE_PROJECT environment is set and valid.

const appUpgradeProject = process.argv[2] || process.env.APP_UPGRADE_PROJECT;

if (!appUpgradeProject) {
  console.error("Environment Variable APP_UPGRADE_PROJECT not defined. Will exit.");
  process.exit(-1);
}

console.log(`app-upgrade project: ${appUpgradeProject}`);

if (appUpgradeProject.toLowerCase().includes("app") || appUpgradeProject.toLowerCase().includes("upgrade")) {
  console.error("APP_UPGRADE_PROJECT should not include the words app or upgrade, and just include"
    + "the environment name. Will exit.");
  process.exit(-1);
}

/// Ensure APP_UPGRADE_CREDENTIALS_FOLDER set and valid.
if (process.argv[3]) {
  credentialPath = process.argv[3];
}
else {
  const appUpgradeCredentialsFolder = process.env.APP_UPGRADE_CREDENTIALS_FOLDER;

  if (!appUpgradeCredentialsFolder) {
    console.error("Environment Variable APP_UPGRADE_CREDENTIALS_FOLDER not defined. Will exit.");
    process.exit(-1);
  }

  console.log(`APP_UPGRADE_CREDENTIALS_FOLDER: ${appUpgradeCredentialsFolder}`);

  credentialPath = path.join(appUpgradeCredentialsFolder, `app-upgrade-${appUpgradeProject}-firebase-adminsdk.json`);
}

console.log(credentialPath);

if(!path.isAbsolute(credentialPath)) {
  console.error(`Credentials Path must be an absolute path. ${credentialPath}. Will exit.`)
  process.exit(-1);
}

if(!existsSync(credentialPath)) {
  console.error(`Credentials path does not exist. ${credentialPath}. Will exit.`)
  process.exit(-1);
}

/// Ensure
const appUpgradeHomeFolderPath = path.resolve(__dirname, '../../');
const clientDirectory = path.join(appUpgradeHomeFolderPath, 'app', 'app-upgrade-client');

if (!existsSync(clientDirectory)) {
  console.error(`Failed to locate client folder. ${clientDirectory}. Will exit.`)
  process.exit(-1);
}

shell.cd(clientDirectory);

const envFile = path.join(clientDirectory, `.env.${appUpgradeProject}`)
if (!existsSync(envFile)) {
  console.error(`Failed to locate .env file. ${envFile}. Will exit.`)
  process.exit(-1);
}

shell.echo(shell.cat(envFile));

let res
  = shell.exec(`./node_modules/.bin/env-cmd -f .env.${appUpgradeProject} ./node_modules/.bin/react-scripts build`);

if (res.code !== 0) {
  console.error(`Failed to build frontend. Will exit.`)
  process.exit(-1);
}

shell.cd(path.join(appUpgradeHomeFolderPath, 'app'));
shell.rm('-rf', 'dist');
shell.cp('-r', 'app-upgrade-client/build', 'dist');

const buildScriptsDirectory = path.join(appUpgradeHomeFolderPath, 'app', 'build-scripts');
if (!existsSync(buildScriptsDirectory)) {
  console.error(`Failed to locate build-scripts folder. ${buildScriptsDirectory}. Will exit.`)
  process.exit(-1);
}

shell.cd(buildScriptsDirectory);
res = shell.exec("yarn build:functions");
if (res.code !== 0) {
  console.error(`Failed to build function. Will exit.`)
  process.exit(-1);
}

shell.cd(path.join(appUpgradeHomeFolderPath, 'app'));
res = shell.exec(`GOOGLE_APPLICATION_CREDENTIALS=${credentialPath} firebase deploy --project=app-upgrade-${appUpgradeProject}`);
shell.echo(res)