import { OnboardNewUserDto, Project } from '@app-upgrade/common';
import firebase from 'firebase';

export enum RequestState {
  INITIAL,

  FETCHING,

  SUCCESS,

  FAILURE
}

export type Function<A, V> = (a: A) => V;

export interface AppUser {
  email: string;
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

export interface IApiClient {
  onboardNewUser(onboardNewUserDto: OnboardNewUserDto): Promise<void>;
  getProjects(): Promise<Project[]>;
}

export interface IAuthService {
  getCurrentUser(): AppUser | null;

  onAuthStateChanged(
    callback: (user: AppUser | null) => any
  ): Function<void, void>;

  createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<AppUser | null>;

  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<AppUser | null>;

  signOut(): Promise<void>;
}

export type FirebaseApp = firebase.app.App;
