const shell = require('shelljs');
const path = require('path');

shell.echo(shell.pwd());
shell.cd('../');
shell.rm('-rf', 'functions-build')
shell.cp("-r", "functions", "functions-build")
shell.cd('functions-build');
const functionsPath = shell.pwd().toString();
const packageJson = JSON.parse(shell.cat(path.join(functionsPath, "package.json")).toString());

const modifiedPackageJson = {
  ...packageJson,
  dependencies: {
    ...packageJson.dependencies,
    "@app-upgrade/common": "file:_common"
  }
}

shell.rm("package.json")
shell.touch("package.json")

shell.echo(JSON.stringify(modifiedPackageJson, null, 2)).to("package.json")
shell.cp('-r', '../common', '_common')
shell.rm('-rf', 'node_modules')
shell.rm('-rf', 'dist')

const tsconfigJson = JSON.parse(shell.cat(path.join(functionsPath, "tsconfig.json")).toString());
delete tsconfigJson.references;

shell.echo(JSON.stringify(tsconfigJson, null, 2)).to("tsconfig.json")

shell.exec('yarn build')

