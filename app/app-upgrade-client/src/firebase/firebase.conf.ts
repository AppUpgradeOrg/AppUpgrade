import { IEnvironment } from '../types';

export type FirebaseConf = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};

export const firebaseConf = (environment: IEnvironment): FirebaseConf => {
  return {
    apiKey: environment.expectValue('REACT_APP_API_KEY'),
    authDomain: environment.expectValue('REACT_APP_AUTH_DOMAIN'),
    projectId: environment.expectValue('REACT_APP_PROJECT_ID'),
    storageBucket: environment.expectValue('REACT_APP_STORAGE_BUCKET'),
    messagingSenderId: environment.expectValue('REACT_APP_MESSAGING_SENDER_ID'),
    appId: environment.expectValue('REACT_APP_APP_ID'),
    measurementId: environment.expectValue('REACT_APP_MEASUREMENT_ID')
  };
};
