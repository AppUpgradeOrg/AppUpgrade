import { IEnvironment } from '../types';

export type FirebaseConf = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  useEmulator: boolean;
};

export const firebaseConf = (environment: IEnvironment): FirebaseConf => {
  return {
    apiKey: environment.expectString('REACT_APP_API_KEY'),
    authDomain: environment.expectString('REACT_APP_AUTH_DOMAIN'),
    projectId: environment.expectString('REACT_APP_PROJECT_ID'),
    storageBucket: environment.expectString('REACT_APP_STORAGE_BUCKET'),
    messagingSenderId: environment.expectString(
      'REACT_APP_MESSAGING_SENDER_ID'
    ),
    appId: environment.expectString('REACT_APP_APP_ID'),
    measurementId: environment.expectString('REACT_APP_MEASUREMENT_ID'),
    useEmulator: environment.getBoolean('REACT_APP_USE_EMULATOR') === true
  };
};
