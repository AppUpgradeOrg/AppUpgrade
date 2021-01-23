import { OnboardNewUserDto } from '@app-upgrade/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { RequestState } from '../types';

export interface OnboardingState {
  onboardNewUserRequestState: RequestState;
}

const initialState: OnboardingState = {
  onboardNewUserRequestState: RequestState.INITIAL
};

const onboarding = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardNewUserRequestState(
      state,
      action: PayloadAction<{ requestState: RequestState }>
    ) {
      state.onboardNewUserRequestState = action.payload.requestState;
    }
  }
});

export const { setOnboardNewUserRequestState } = onboarding.actions;

export const onboardNewUser = (
  organizationName: string,
  projectName: string,
  environmentName: string,
  domainName: string
): AppThunk => async (dispatch, getState, { firebaseApp }) => {
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

    await firebaseApp.functions().httpsCallable('onboardNewUser')(
      onboardNewUserDto
    );
    dispatch(
      setOnboardNewUserRequestState({ requestState: RequestState.SUCCESS })
    );
  } catch (e) {
    dispatch(
      setOnboardNewUserRequestState({ requestState: RequestState.FAILURE })
    );
  }
};

export const onboardingReducer = onboarding.reducer;
