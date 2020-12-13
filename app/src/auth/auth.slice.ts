import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { app } from '../firebase/firebase.service';
import { AppThunk } from '../store';

export enum RequestState {
  INITIAL,

  FETCHING,

  SUCCESS,

  FAILURE
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AppUser | undefined | null;
  newUserRequestState: RequestState;
  signInRequestState: RequestState;
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
  newUserRequestState: RequestState.INITIAL,
  signInRequestState: RequestState.INITIAL,
  signInError: undefined,
  signUpUserErr: undefined,
  signUpPasswordErr: undefined
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(
      state,
      action: PayloadAction<{ isAuthenticated: boolean }>
    ) {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setUser(state, action: PayloadAction<{ user: AppUser | null }>) {
      state.user = action.payload.user;
      state.isAuthenticated = Boolean(action.payload.user);
    },
    setSignInError(
      state,
      action: PayloadAction<{ signInError: string | undefined }>
    ) {
      state.signInError = action.payload.signInError;
    },
    setSignUpUserErr(
      state,
      action: PayloadAction<{ signUpUserErr: string | undefined }>
    ) {
      state.signUpUserErr = action.payload.signUpUserErr;
    },
    setSignUpPasswordErr(
      state,
      action: PayloadAction<{ signUpPasswordErr: string | undefined }>
    ) {
      state.signUpPasswordErr = action.payload.signUpPasswordErr;
    },
    setNewUserRequestState(
      state,
      action: PayloadAction<{ newUserRequestState: RequestState }>
    ) {
      state.newUserRequestState = action.payload.newUserRequestState;
    },
    resetNewUserTransientValues(state) {
      state.newUserRequestState = initialState.newUserRequestState;
    },
    setSignInRequestState(
      state,
      action: PayloadAction<{ signInRequestState: RequestState }>
    ) {
      state.signInRequestState = action.payload.signInRequestState;
    },
    resetSignInTransientValues(state) {
      state.signInRequestState = initialState.signInRequestState;
      state.signInError = initialState.signInError;
    }
  }
});

export const {
  setAuthenticated,
  setUser,
  setSignInError,
  setSignUpUserErr,
  setSignUpPasswordErr,
  setNewUserRequestState,
  resetNewUserTransientValues,
  setSignInRequestState,
  resetSignInTransientValues
} = auth.actions;

export const resetSignUpErrors = (): AppThunk => async (dispatch) => {
  // Clear out any existing errors.
  dispatch(setSignUpUserErr({ signUpUserErr: undefined }));
  dispatch(setSignUpPasswordErr({ signUpPasswordErr: undefined }));
};

export const resetSignInErrors = (): AppThunk => async (dispatch) => {
  dispatch(setSignInError({ signInError: undefined }));
};

export const initializeUser = (): AppThunk => async (dispatch) => {
  const { currentUser } = app.auth();
  if (currentUser) {
    dispatch(setUser({ user: { email: currentUser.email! } }));
  }

  app.auth().onAuthStateChanged(async (result) => {
    if (result) {
      dispatch(setUser({ user: { email: result.email! } }));
    } else {
      dispatch(setUser({ user: null }));
    }
  });
};

export const newUser = (email: string, password: string): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(resetSignUpErrors());
    dispatch(
      setNewUserRequestState({ newUserRequestState: RequestState.FETCHING })
    );
    const credential = await app
      .auth()
      .createUserWithEmailAndPassword(email, password);
    if (credential.user) {
      dispatch(
        setNewUserRequestState({ newUserRequestState: RequestState.SUCCESS })
      );
      dispatch(setUser({ user: { email: credential.user.email! } }));
    } else {
      dispatch(
        setNewUserRequestState({ newUserRequestState: RequestState.FAILURE })
      );
      dispatch(setUser({ user: null }));
    }
  } catch (err) {
    dispatch(
      setNewUserRequestState({ newUserRequestState: RequestState.FAILURE })
    );
    switch (err.code) {
      case 'auth/email-already-in-use':
        dispatch(
          setSignUpUserErr({
            signUpUserErr:
              'Looks like you already have an account. Click Login.'
          })
        );
        break;
      case 'auth/invalid-email':
        dispatch(
          setSignUpUserErr({ signUpUserErr: 'Please enter a valid email' })
        );
        break;
      case 'auth/weak-password':
        dispatch(
          setSignUpPasswordErr({
            signUpPasswordErr: 'Password must be at least 6 characters'
          })
        );
        break;
      default:
        break;
    }
  }
};

export const signInUser = (email: string, password: string): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(
      setSignInRequestState({ signInRequestState: RequestState.FETCHING })
    );
    const credential = await app
      .auth()
      .signInWithEmailAndPassword(email, password);

    if (credential.user) {
      dispatch(
        setSignInRequestState({ signInRequestState: RequestState.SUCCESS })
      );
      dispatch(setUser({ user: { email: credential.user.email! } }));
    } else {
      dispatch(
        setSignInRequestState({ signInRequestState: RequestState.FAILURE })
      );
      dispatch(setUser({ user: null }));
    }
  } catch (err) {
    dispatch(
      setSignInRequestState({ signInRequestState: RequestState.FAILURE })
    );
    dispatch(setSignInError({ signInError: 'Incorrect, email or password' }));
  }
};

export const signOutUser = (): AppThunk => async (dispatch) => {
  await app.auth().signOut();
  dispatch(setUser({ user: null }));
};

export const authReducer = auth.reducer;
