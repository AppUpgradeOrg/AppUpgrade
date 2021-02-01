import firebase from 'firebase';

export enum RequestState {
  INITIAL,

  FETCHING,

  SUCCESS,

  FAILURE
}

export interface IEnvironment {
  has: (key: string) => boolean;
  getValue: (key: string) => string | undefined;
  expectValue: (key: string) => string;
}

export type FirebaseApp = firebase.app.App;
