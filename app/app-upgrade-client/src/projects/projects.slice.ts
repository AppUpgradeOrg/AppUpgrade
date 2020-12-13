import { Project } from '@app-upgrade/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { app } from '../firebase/firebase.service';
import { AppThunk } from '../store';
import { RequestState } from '../types';

export interface ProjectsState {
  projects: Project[];
  fetchProjectsState: RequestState;
}

const initialState: ProjectsState = {
  projects: [],
  fetchProjectsState: RequestState.INITIAL
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setFetchProjectsRequestState(
      state,
      action: PayloadAction<{ requestState: RequestState }>
    ) {
      state.fetchProjectsState = action.payload.requestState;
    },
    setProjects(state, action: PayloadAction<{ projects: Project[] }>) {
      state.projects = action.payload.projects;
    }
  }
});

export const { setFetchProjectsRequestState } = projectsSlice.actions;

export const fetchProjects = (): AppThunk => async (dispatch) => {
  dispatch(
    setFetchProjectsRequestState({ requestState: RequestState.FETCHING })
  );

  try {
    const res = await app.functions().httpsCallable('getProjects')();

    dispatch(
      projectsSlice.actions.setProjects({ projects: res.data as Project[] })
    );
    dispatch(
      setFetchProjectsRequestState({ requestState: RequestState.SUCCESS })
    );
  } catch (e) {
    console.log('Error fetching projects', e);
    dispatch(
      setFetchProjectsRequestState({ requestState: RequestState.FAILURE })
    );
  }
};

export const projectsReducer = projectsSlice.reducer;
