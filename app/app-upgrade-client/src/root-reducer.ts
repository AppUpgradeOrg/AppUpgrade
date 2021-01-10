import { combineReducers } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { authReducer } from './auth/auth.slice';
// eslint-disable-next-line import/no-cycle
import { onboardingReducer } from './onboarding/onboarding.slice';
// eslint-disable-next-line import/no-cycle
import { projectsReducer } from './projects/projects.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
  projects: projectsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
