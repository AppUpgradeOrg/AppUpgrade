import { Conf } from '@app-upgrade/common';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../root-reducer';
import { AppThunk } from '../store';
import { RequestState } from '../types';

export interface ConfState {
  fetchConfState: RequestState;
  conf?: Conf;
}

const initialState: ConfState = {
  fetchConfState: RequestState.INITIAL,
  conf: undefined
};

const conf = createSlice({
  name: 'conf',
  initialState,
  reducers: {
    setFetchConfState(
      state,
      action: PayloadAction<{
        requestState: RequestState;
        conf?: Conf;
      }>
    ) {
      state.fetchConfState = action.payload.requestState;
      state.conf = action.payload.conf;
    }
  }
});

export const { setFetchConfState } = conf.actions;

export const fetchConf = (): AppThunk => async (
  dispatch,
  getState,
  { apiClient }
) => {
  dispatch(setFetchConfState({ requestState: RequestState.FETCHING }));

  try {
    const conf = await apiClient.fetchConf();
    dispatch(
      setFetchConfState({
        requestState: RequestState.SUCCESS,
        conf
      })
    );
  } catch (e) {
    dispatch(setFetchConfState({ requestState: RequestState.FAILURE }));
  }
};

/// Selectors

const selectConf = (state: RootState) => state.conf;
export const confSelectors = {
  expectConf: createSelector(selectConf, (conf) => conf.conf!)
};

export const confReducer = conf.reducer;
