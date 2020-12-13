import { combineReducers } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { authReducer } from "./auth/auth.slice";
// eslint-disable-next-line import/no-cycle

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
