import firebase from 'firebase';

export enum RequestState {
  INITIAL,

  FETCHING,

  SUCCESS,

  FAILURE
}

export interface IEnvironment {
  has: (key: string) => boolean;
  getString: (key: string) => string | undefined;
  expectString: (key: string) => string;
  getBoolean: (key: string) => boolean | undefined;
  expectBoolean: (key: string) => boolean;
  getNumber: (key: string) => number | undefined;
  expectNumber: (key: string) => number;
}

export type FirebaseApp = firebase.app.App;
