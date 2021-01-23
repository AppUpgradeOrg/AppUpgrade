import firebase from 'firebase';
import { FirebaseConf } from './firebase.conf';

export const configureFirebaseApp = (conf: FirebaseConf) => {
  const { useEmulator, ...effectiveFirebaseConf } = conf;
  const app = firebase.initializeApp(effectiveFirebaseConf);

  if (useEmulator) {
    app.functions().useEmulator('localhost', 5001);
    app.auth().useEmulator('http://localhost:9099/');
  }

  return app;
};
