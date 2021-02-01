import firebase from 'firebase';
import { FirebaseConf } from './firebase.conf';

export const configureFirebaseApp = (conf: FirebaseConf) => {
  return firebase.initializeApp(conf);
};
