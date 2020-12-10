import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { app } from "../firebase/firebase.service";
import { AppThunk } from "../store";
export interface AuthState {
  isAuthenticated: boolean;
  user: AppUser | undefined | null;
  signInError: string | undefined;
  signUpUserErr: string | undefined;
  signUpPasswordErr: string | undefined;
}

export interface AppUser {
  email: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined, 
  signInError: undefined,
  signUpUserErr: undefined,
  signUpPasswordErr: undefined
}

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<{ isAuthenticated: boolean }>) {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setUser(state, action: PayloadAction<{user: AppUser | null}>) {
      state.user = action.payload.user;
      state.isAuthenticated = Boolean(action.payload.user)
    },
    setSignInError(state, action: PayloadAction<{ signInError: string | undefined }>) {
      state.signInError = action.payload.signInError;
    },
    setSignUpUserErr(state, action: PayloadAction<{ signUpUserErr: string | undefined }>) {
      state.signUpUserErr = action.payload.signUpUserErr;
    },
    setSignUpPasswordErr(state, action: PayloadAction<{ signUpPasswordErr: string | undefined }>) {
      state.signUpPasswordErr = action.payload.signUpPasswordErr;
    }
  }
});

export const {
  setAuthenticated,
  setUser, 
  setSignInError,
  setSignUpUserErr,
  setSignUpPasswordErr
} = auth.actions;

export const initializeUser = (): AppThunk => async dispatch => {
  const { currentUser } = app.auth();
  if (currentUser) {
    dispatch(setUser({ user: { email: currentUser.email! } }));
  }

  app.auth().onAuthStateChanged(async result => {
    if (result) {
      dispatch(setUser({ user: { email: result.email! } }));
    } else {
      dispatch(setUser({ user: null }));
    }
  });
}

export const newUser = (email: string, password: string):AppThunk => async dispatch => {
  try {
    const credential = await app.auth().createUserWithEmailAndPassword(email, password)
    if (credential.user) {
      dispatch(setUser({ user: { email: credential.user.email! }}));
    } else {
      dispatch(setUser({ user: null }));
      dispatch(setSignUpUserErr({ signUpUserErr: undefined }));
      dispatch(setSignUpPasswordErr({ signUpPasswordErr: undefined }));
    }
  } catch (err) {
    switch (err.code) {
      case 'auth/email-already-in-use':
        dispatch(setSignUpUserErr({signUpUserErr: 'Looks like you already have an account. Click Login.'}))
        break;
      case 'auth/invalid-email':
        dispatch(setSignUpUserErr({signUpUserErr: 'Please enter a valid email'}))
        break;
      case 'auth/weak-password':
        dispatch(setSignUpPasswordErr({signUpPasswordErr: 'Password must be at least 6 characters'}))
        break;
      default:
        break;
    }
  }
}

export const signInUser = (email: string, password: string): AppThunk => async dispatch => {
  try {
    const credential = await app.auth().signInWithEmailAndPassword(email, password);
    if (credential.user) {
      dispatch(setUser({ user: { email: credential.user.email! }}));
    } else {
      dispatch(setUser({ user: null }));
    }
  } catch (err) {
    dispatch(setSignInError({ signInError: 'Incorrect, email or password'}))
  }
}

export const authReducer = auth.reducer;
