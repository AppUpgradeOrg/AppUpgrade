import { Action, configureStore } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
// eslint-disable-next-line import/no-cycle
import { rootReducer, RootState } from './root-reducer';

export const store = configureStore({ reducer: rootReducer });
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
