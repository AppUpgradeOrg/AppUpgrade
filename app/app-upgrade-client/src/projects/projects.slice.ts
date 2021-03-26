import {
  AddNewEnvironmentDto,
  AddNewProjectDto,
  Project
} from '@app-upgrade/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { RequestState } from '../types';

export interface ProjectsState {
  projects: Project[];
  fetchProjectsState: RequestState;
  newProject?: Project;
  addNewProjectRequestState: RequestState;
  newEnvironmentId?: string;
  addNewEnvironmentRequestState: RequestState;
}

const initialState: ProjectsState = {
  projects: [],
  fetchProjectsState: RequestState.INITIAL,
  newProject: undefined,
  addNewProjectRequestState: RequestState.INITIAL,
  newEnvironmentId: undefined,
  addNewEnvironmentRequestState: RequestState.INITIAL
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
    },
    setNewProject(
      state,
      action: PayloadAction<{
        newProject?: Project;
      }>
    ) {
      state.newProject = action.payload.newProject;
    },
    setAddNewProjectRequestState(
      state,
      action: PayloadAction<{ requestState: RequestState }>
    ) {
      state.addNewProjectRequestState = action.payload.requestState;
    },
    setNewEnvironmentId(
      state,
      action: PayloadAction<{ newEnvironmentId?: string }>
    ) {
      state.newEnvironmentId = action.payload.newEnvironmentId;
    },
    setAddNewEnvironmentRequestState(
      state,
      action: PayloadAction<{ requestState: RequestState }>
    ) {
      state.addNewEnvironmentRequestState = action.payload.requestState;
    },
    resetProjectsToInitialState(state) {
      state.projects = initialState.projects;
      state.fetchProjectsState = initialState.fetchProjectsState;
      state.newProject = initialState.newProject;
      state.addNewProjectRequestState = initialState.addNewProjectRequestState;
      state.newEnvironmentId = initialState.newEnvironmentId;
      state.addNewEnvironmentRequestState =
        initialState.addNewEnvironmentRequestState;
    }
  }
});

export const {
  setFetchProjectsRequestState,
  setProjects,
  setNewProject,
  setAddNewProjectRequestState,
  setAddNewEnvironmentRequestState,
  setNewEnvironmentId,
  resetProjectsToInitialState
} = projectsSlice.actions;

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

export const addNewProject = (
  addNewProjectDto: AddNewProjectDto
): AppThunk => async (dispatch, getState, { apiClient }) => {
  dispatch(setNewProject({ newProject: undefined }));
  dispatch(
    setAddNewProjectRequestState({ requestState: RequestState.FETCHING })
  );

  try {
    const newProject = await apiClient.addNewProject(addNewProjectDto);

    dispatch(setNewProject({ newProject }));
    dispatch(
      setAddNewProjectRequestState({ requestState: RequestState.SUCCESS })
    );
  } catch (e) {
    console.error('Error adding new project', e);
    dispatch(
      setAddNewProjectRequestState({ requestState: RequestState.FAILURE })
    );
  }
};

export const addNewEnvironmentToProject = (
  addNewEnvironmentDto: AddNewEnvironmentDto
): AppThunk => async (dispatch, getState, { apiClient }) => {
  dispatch(setNewEnvironmentId({ newEnvironmentId: undefined }));
  dispatch(
    setAddNewEnvironmentRequestState({ requestState: RequestState.FETCHING })
  );

  try {
    const newEnvironmentId = await apiClient.addNewEnvironmentToProject(
      addNewEnvironmentDto
    );

    dispatch(projectsSlice.actions.setNewEnvironmentId({ newEnvironmentId }));
    dispatch(
      setAddNewEnvironmentRequestState({ requestState: RequestState.SUCCESS })
    );
  } catch (e) {
    console.error('Error adding new environment', e);
    dispatch(
      setAddNewEnvironmentRequestState({ requestState: RequestState.FAILURE })
    );
  }
};

export const projectsReducer = projectsSlice.reducer;
