import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { app } from "../firebase/firebase.service";
import { AppThunk } from "../store";
export interface AuthState {
  isAuthenticated: boolean;
  user: AppUser | undefined | null;
  signInError: string | undefined;
}

export interface AppUser {
  email: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined, 
  signInError: undefined
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
    setError(state, action: PayloadAction<{ signInError: string | undefined }>) {
      state.signInError = action.payload.signInError;
    }
  }
});

export const {
  setAuthenticated,
  setUser, 
  setError
} = auth.actions;

export const initializeUser = (): AppThunk => async dispatch => {
  const { currentUser } = app.auth();
  if (currentUser) {
    dispatch(setUser({ user: { email: currentUser.email! } }));
  }

  app.auth().onAuthStateChanged(async result => {
    console.log('state changed')
    if (result) {
      dispatch(setUser({ user: { email: result.email! } }));
    } else {
      dispatch(setUser({ user: null }));
    }
  });
}

export const signInUser = (email: string, password: string): AppThunk => async dispatch => {
  // todo try-catch with sign-in errors
  try {
    const credential = await app.auth().signInWithEmailAndPassword(email, password);
    if (credential.user) {
      dispatch(setUser({ user: { email: credential.user.email! }}));
    } else {
      dispatch(setUser({ user: null }));
    }
  } catch (err) {
    dispatch(setError({ signInError: 'Incorrect, email or password'}))
  }
}

export const authReducer = auth.reducer;
