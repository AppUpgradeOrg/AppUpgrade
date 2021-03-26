import { OnboardNewUserDto } from '@app-upgrade/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { RequestState } from '../types';

export interface OnboardingState {
  onboardNewUserRequestState: RequestState;
  firstEnvironmentId?: string;
}

const initialState: OnboardingState = {
  onboardNewUserRequestState: RequestState.INITIAL,
  firstEnvironmentId: undefined
};

const onboarding = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardNewUserRequestState(
      state,
      action: PayloadAction<{
        requestState: RequestState;
        firstEnvironmentId?: string;
      }>
    ) {
      state.onboardNewUserRequestState = action.payload.requestState;
      state.firstEnvironmentId = action.payload.firstEnvironmentId;
    },
    resetOnboardingToInitialState(state) {
      state.firstEnvironmentId = initialState.firstEnvironmentId;
      state.onboardNewUserRequestState =
        initialState.onboardNewUserRequestState;
    }
  }
});

export const {
  setOnboardNewUserRequestState,
  resetOnboardingToInitialState
} = onboarding.actions;

export const onboardNewUser = (
  organizationName: string,
  projectName: string,
  environmentName: string,
  domainName: string
): AppThunk => async (dispatch, getState, { apiClient }) => {
  dispatch(
    setOnboardNewUserRequestState({ requestState: RequestState.FETCHING })
  );

  try {
    const onboardNewUserDto: OnboardNewUserDto = {
      organizationName,
      projectName,
      projectReleaseStrategy: 'MANUAL',
      environmentName,
      domainName
    };

    const firstEnvironmentId = await apiClient.onboardNewUser(
      onboardNewUserDto
    );
    dispatch(
      setOnboardNewUserRequestState({
        requestState: RequestState.SUCCESS,
        firstEnvironmentId
      })
    );
  } catch (e) {
    dispatch(
      setOnboardNewUserRequestState({ requestState: RequestState.FAILURE })
    );
  }
};

export const onboardingReducer = onboarding.reducer;
