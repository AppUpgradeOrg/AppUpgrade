const fs = require('fs');
const path = require('path');

if (!process.env.NODE_ENV) {
  console.error("NODE_ENV required. Will exit.");
  process.exit(-1);
}

const nodeEnv = process.env.NODE_ENV;

const defaultEnvPath = path.resolve('../functions/remote-env/default.env');
const nodeEnvPath = path.resolve(`../functions/remote-env/${nodeEnv}.env`);

if (!fs.existsSync(defaultEnvPath)) {
  console.error(`Default env file ${defaultEnvPath} does not exist. Will exit.`);
  process.exit(-1);
}

if (!fs.existsSync(nodeEnvPath)) {
  console.error(`Node env file ${nodeEnvPath} does not exist. Will exit.`);
  process.exit(-1);
}

const defaultEnvContents = fs.readFileSync(defaultEnvPath, "utf8");
const nodeEnvContents = fs.readFileSync(nodeEnvPath, "utf8");

const lines = [...defaultEnvContents.split('\n'), ...nodeEnvContents.split('\n')];

const resultingEnv = lines.reduce((memo, currentValue) => {
  const firstEqualsIndex = currentValue.indexOf('=');
  if (firstEqualsIndex === -1) {
    console.error(`Invalid env line ${currentValue}. No equals sign found`);
    process.exit(-1);
  }

  const key = currentValue.substr(0, firstEqualsIndex)
  const value = currentValue.substr(firstEqualsIndex + 1)
  return {
    ...memo,
    [key]: value
  }

}, {});

const args = Object.keys(resultingEnv).map(key => {
  return `${key}="${resultingEnv[key]}"`
})
.join(' ');

console.log(args);