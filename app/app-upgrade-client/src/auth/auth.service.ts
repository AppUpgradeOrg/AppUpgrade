import firebase from 'firebase';
import { AppUser, FirebaseApp, Function, IAuthService } from '../types';

export class FirebaseAuthService implements IAuthService {
  constructor(private readonly firebaseApp: FirebaseApp) {}

  getCurrentUser(): AppUser | null {
    return this.firebaseUserToAppUser(this.firebaseApp.auth().currentUser);
  }

  onAuthStateChanged(
    callback: (user: AppUser | null) => any
  ): Function<void, void> {
    return this.firebaseApp.auth().onAuthStateChanged((result) => {
      callback(this.firebaseUserToAppUser(result));
    });
  }

  async createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<AppUser | null> {
    const credential = await this.firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password);

    if (credential.user) {
      return this.firebaseUserToAppUser(credential.user);
    } else {
      return this.firebaseUserToAppUser(null);
    }
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<AppUser | null> {
    const credential = await this.firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password);

    if (credential.user) {
      return this.firebaseUserToAppUser(credential.user);
    } else {
      return this.firebaseUserToAppUser(null);
    }
  }

  signOut(): Promise<void> {
    return this.firebaseApp.auth().signOut();
  }

  private firebaseUserToAppUser(
    firebaseUser: firebase.User | null
  ): AppUser | null {
    if (firebaseUser) {
      if (!firebaseUser.email) {
        throw new Error(`User ${firebaseUser.uid} does not have email set`);
      }

      return { email: firebaseUser.email };
    }

    return null;
  }
}
