import { Action, configureStore } from '@reduxjs/toolkit';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
// eslint-disable-next-line import/no-cycle
import { rootReducer, RootState } from './root-reducer';
import { IApiClient, IAuthService } from './types';

export const configureAppStore = (
  apiClient: IApiClient,
  authService: IAuthService
) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            apiClient,
            authService
          }
        }
      })
  });
};

export type AppStore = ReturnType<typeof configureAppStore>;

export type AppDispatch = ThunkDispatch<
  RootState,
  { apiClient: IApiClient; authService: IAuthService },
  Action
>;

export type AppThunk = ThunkAction<
  void,
  RootState,
  { apiClient: IApiClient; authService: IAuthService },
  Action<string>
>;
