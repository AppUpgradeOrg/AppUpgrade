# AppUpgrade specific commands/aliases

alias app-upgrade="cd $APP_UPGRADE_HOME"

function capturedir() {
  export captured=$(pwd)
}

function app-upgrade-clean() {
  capturedir
  source $APP_UPGRADE_HOME/app/.bin/clean.sh
  cd $captured
  unset captured
}

function app-upgrade-install() {
  capturedir
  source $APP_UPGRADE_HOME/app/.bin/install.sh
  cd $captured
  unset captured
}

function app-upgrade-build() {
  capturedir
  source $APP_UPGRADE_HOME/app/.bin/build.sh
  cd $captured
  unset captured
}