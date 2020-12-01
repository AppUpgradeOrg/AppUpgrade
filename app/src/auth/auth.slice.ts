import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: true,
}

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<{ isAuthenticated: boolean }>) {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
  }
});

export const {
  setAuthenticated
} = auth.actions;

export const authReducer = auth.reducer;
