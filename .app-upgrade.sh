# Set app-upgrade-alpha as current firebase/google credentials
alias app-upgrade:dev="app-upgrade && osascript .dev.scpt"

alias app-upgrade-alpha='cd $APP_UPGRADE_HOME/app \
  && firebase use app-upgrade-alpha \
  && ([ -f $APP_UPGRADE_HOME/app/app-upgrade-client/.env.local ] \
      && { echo "Old .env.local"; cat $APP_UPGRADE_HOME/app/app-upgrade-client/.env.local; } \
      || echo ".env.local does not exist") \
  && cp $APP_UPGRADE_HOME/app/app-upgrade-client/.env.alpha $APP_UPGRADE_HOME/app/app-upgrade-client/.env.local \
  && echo "\nREACT_APP_USE_EMULATOR=true" >> $APP_UPGRADE_HOME/app/app-upgrade-client/.env.local \
  && cd - \
  && export GOOGLE_APPLICATION_CREDENTIALS=$APP_UPGRADE_CREDENTIALS_FOLDER/app-upgrade-alpha-firebase-adminsdk.json \
  && echo $GOOGLE_APPLICATION_CREDENTIALS'

alias app-upgrade-gamma='cd $APP_UPGRADE_HOME/app \
  && firebase use app-upgrade-gamma \
  && ([ -f $APP_UPGRADE_HOME/app/app-upgrade-client/.env.local ] \
      && { echo "Old .env.local"; cat $APP_UPGRADE_HOME/app/app-upgrade-client/.env.local; } \
      || echo ".env.local does not exist") \
  && cp $APP_UPGRADE_HOME/app/app-upgrade-client/.env.gamma $APP_UPGRADE_HOME/app/app-upgrade-client/.env.local \
  && echo "\nREACT_APP_USE_EMULATOR=true" >> $APP_UPGRADE_HOME/app/app-upgrade-client/.env.local \
  && cd - \
  && export GOOGLE_APPLICATION_CREDENTIALS=$APP_UPGRADE_CREDENTIALS_FOLDER/app-upgrade-gamma-firebase-adminsdk.json \
  && echo $GOOGLE_APPLICATION_CREDENTIALS'

alias app-upgrade:dev:firebase='cd $APP_UPGRADE_HOME/app \
  && ([ -f $APP_UPGRADE_HOME/app/emulator.data ] \
      && firebase emulators:start --only firestore,functions,pubsub,auth --import=./emulator.data \
      || firebase emulators:start --only firestore,functions,pubsub,auth --export-on-exit=./emulator.data)'

alias app-upgrade:dev:common='cd $APP_UPGRADE_HOME/app \
  && yarn watch:common'

alias app-upgrade:dev:functions='cd $APP_UPGRADE_HOME/app \
  && yarn watch:functions'

alias app-upgrade:dev:app='cd $APP_UPGRADE_HOME/app/app-upgrade-client \
  && yarn start'

alias app-upgrade:dev:web-sdk='cd $APP_UPGRADE_HOME/app/web-sdk \
  && yarn build:dev && yarn serve'