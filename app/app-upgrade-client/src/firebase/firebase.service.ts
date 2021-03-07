import firebase from 'firebase';
import { FirebaseConf } from './firebase.conf';

export const configureFirebaseApp = (conf: FirebaseConf) => {
  const { useEmulator, ...effectiveFirebaseConf } = conf;

  // An existing firebase app would only exist in a dev environment with hot reload
  const app = !firebase.apps.length
    ? firebase.initializeApp(effectiveFirebaseConf)
    : firebase.app();

  if (useEmulator) {
    app.functions().useEmulator('localhost', 5001);
    app.auth().useEmulator('http://localhost:9099/');
  }

  return app;
};
