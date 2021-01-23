import { Action, configureStore } from '@reduxjs/toolkit';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
// eslint-disable-next-line import/no-cycle
import { rootReducer, RootState } from './root-reducer';
import { FirebaseApp } from './types';

export const configureAppStore = (firebaseApp: FirebaseApp) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            firebaseApp
          }
        }
      })
  });
};

export type AppDispatch = ThunkDispatch<
  RootState,
  { firebaseApp: FirebaseApp },
  Action
>;

export type AppThunk = ThunkAction<
  void,
  RootState,
  { firebaseApp: FirebaseApp },
  Action<string>
>;
