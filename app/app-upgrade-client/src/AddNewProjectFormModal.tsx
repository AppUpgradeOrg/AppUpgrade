import { Box, Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner } from './LoadingSpinner';
import {
  ModalBody,
  MODAL_PADDING_UNITS,
  MODAL_WIDTH_PIXELS
} from './ModalBody';
import {
  addNewProject,
  setAddNewProjectRequestState,
  setNewProject
} from './projects/projects.slice';
import { RootState } from './root-reducer';
import { RequestState } from './types';
import { WebSdkCodeSnippet } from './WebSdkCodeSnippet';

const useStyles = makeStyles((theme) => ({
  codeContainer: {
    maxWidth: `calc(${MODAL_WIDTH_PIXELS}px - ${
      theme.spacing(MODAL_PADDING_UNITS) * 2
    }px)`
  }
}));

export type AddNewProjectFormModalProps = {
  addNewProjectCompleted: () => void;
};

export const AddNewProjectFormModal: FC<AddNewProjectFormModalProps> = ({
  addNewProjectCompleted
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState('');
  const [environmentName, setEnvironmentName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [stepIndex, setStepIndex] = useState(0);

  const { addNewProjectRequestState, newProject } = useSelector(
    (rootState: RootState) => {
      return {
        addNewProjectRequestState: rootState.projects.addNewProjectRequestState,
        newProject: rootState.projects.newProject
      };
    }
  );

  const isFetching = addNewProjectRequestState === RequestState.FETCHING;

  // Reset to initial state when component first mounted
  useEffect(() => {
    dispatch(setNewProject({ newProject: undefined }));
    dispatch(
      setAddNewProjectRequestState({ requestState: RequestState.INITIAL })
    );
  }, [dispatch]);

  const steps = useMemo(() => {
    return [
      {
        component: (
          <Box>
            <Typography variant="h6">
              What do you want to name your project?
            </Typography>
            <TextField
              required
              value={projectName}
              autoFocus
              onChange={(e) => setProjectName(e.target.value)}
              id="project-name"
              label="Project Name"
              helperText="You can always come back and change this later."
            />
          </Box>
        ),
        isValid: () => {
          return projectName.length > 0;
        }
      },
      {
        component: (
          <Box>
            <Typography variant="h6">
              What do you want to name your environment?
            </Typography>
            <TextField
              required
              value={environmentName}
              autoFocus
              onChange={(e) => setEnvironmentName(e.target.value)}
              id="new-environment-name"
              label="Environment Name"
              helperText="Dev? Staging? Production?"
            />
          </Box>
        ),
        isValid: () => {
          return environmentName.length > 0;
        }
      },
      {
        component: (
          <Box>
            <Typography variant="h6">
              What is the domain name for this environment?
            </Typography>
            <TextField
              required
              value={domainName}
              autoFocus
              onChange={(e) => setDomainName(e.target.value)}
              id="new-domain-name"
              label="Domain name"
              helperText="Include subdomain as well if one exists."
            />
          </Box>
        ),
        isValid: () => {
          return domainName.length > 0;
        }
      }
    ];
  }, [domainName, environmentName, projectName]);

  const onNextButtonPressed = useCallback(
    (event: React.MouseEvent | React.FormEvent) => {
      event.stopPropagation();
      event.preventDefault();

      if (stepIndex === steps.length - 1) {
        dispatch(
          addNewProject({
            projectName,
            projectReleaseStrategy: 'MANUAL',
            environmentName,
            domainName
          })
        );
      } else {
        setStepIndex(stepIndex + 1);
      }
    },
    [
      stepIndex,
      steps.length,
      dispatch,
      projectName,
      environmentName,
      domainName
    ]
  );

  const onBackButtonPressed = useCallback(() => {
    setStepIndex(stepIndex - 1);
  }, [stepIndex, setStepIndex]);

  const body = (
    <ModalBody>
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent={isFetching ? 'flex-start' : 'space-between'}
      >
        {!isFetching && !newProject && (
          <>
            <Box>
              <h1 id="new-project-form-title">Add New Project</h1>
              <form id="new-project-form" onSubmit={onNextButtonPressed}>
                {steps[stepIndex].component}
                <Box display="flex" justifyContent="flex-end">
                  <Box marginRight={1}>
                    <Button
                      onClick={onBackButtonPressed}
                      variant="contained"
                      disabled={stepIndex === 0}
                    >
                      Back
                    </Button>
                  </Box>
                  <Button
                    type="submit"
                    disabled={
                      stepIndex === steps.length || !steps[stepIndex].isValid()
                    }
                    variant="contained"
                    color="primary"
                  >
                    Next
                  </Button>
                </Box>
              </form>
            </Box>
          </>
        )}

        {isFetching && (
          <>
            <Box marginTop={8}>
              <LoadingSpinner />
            </Box>
          </>
        )}

        {!isFetching && newProject && (
          <>
            <Box>
              <Typography variant="h6">
                Environment was successfully added to project.
              </Typography>
              <Box marginTop={1}>
                <Typography variant="body1">
                  The next step is to integrate your application with your
                  AppUpgrade environment.
                </Typography>
              </Box>
              <Box marginTop={3}>
                <Typography variant="body1">
                  {
                    'Copy and paste this script into the bottom of your <body> tag'
                  }
                </Typography>
              </Box>
              <Box className={classes.codeContainer}>
                <WebSdkCodeSnippet
                  environmentId={newProject.environments[0].environmentId}
                />
              </Box>
              <Box marginTop={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addNewProjectCompleted()}
                >
                  Finish
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </ModalBody>
  );

  return body;
};
