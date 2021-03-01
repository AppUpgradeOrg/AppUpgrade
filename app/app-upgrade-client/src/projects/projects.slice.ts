import { Project } from '@app-upgrade/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export const fetchProjects = (): AppThunk => async (
  dispatch,
  getState,
  { apiClient }
) => {
  dispatch(
    setFetchProjectsRequestState({ requestState: RequestState.FETCHING })
  );

  try {
    const projects = await apiClient.getProjects();

    dispatch(projectsSlice.actions.setProjects({ projects }));
    dispatch(
      setFetchProjectsRequestState({ requestState: RequestState.SUCCESS })
    );
  } catch (e) {
    console.error('Error fetching projects', e);
    dispatch(
      setFetchProjectsRequestState({ requestState: RequestState.FAILURE })
    );
  }
};

export const projectsReducer = projectsSlice.reducer;
