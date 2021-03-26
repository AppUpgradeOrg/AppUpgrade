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
  addNewEnvironmentToProject,
  setAddNewEnvironmentRequestState,
  setNewEnvironmentId
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

export type AddNewEnvironmentFormModalProps = {
  projectId: string;
  addNewEnvironmentCompleted: () => void;
};

export const AddNewEnvironmentFormModal: FC<AddNewEnvironmentFormModalProps> = ({
  projectId,
  addNewEnvironmentCompleted
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [environmentName, setEnvironmentName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [stepIndex, setStepIndex] = useState(0);

  const { addNewEnvironmentRequestState, newEnvironmentId } = useSelector(
    (rootState: RootState) => {
      return {
        addNewEnvironmentRequestState:
          rootState.projects.addNewEnvironmentRequestState,
        newEnvironmentId: rootState.projects.newEnvironmentId
      };
    }
  );

  const isFetching = addNewEnvironmentRequestState === RequestState.FETCHING;

  // Reset to initial state when component first mounted
  useEffect(() => {
    dispatch(setNewEnvironmentId({ newEnvironmentId: undefined }));
    dispatch(
      setAddNewEnvironmentRequestState({ requestState: RequestState.INITIAL })
    );
  }, [dispatch]);

  const steps = useMemo(() => {
    return [
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
  }, [domainName, environmentName]);

  const onNextButtonPressed = useCallback(
    (event: React.MouseEvent | React.FormEvent) => {
      event.stopPropagation();
      event.preventDefault();

      if (stepIndex === steps.length - 1) {
        dispatch(
          addNewEnvironmentToProject({
            projectId,
            environmentName,
            domainName
          })
        );
      } else {
        setStepIndex(stepIndex + 1);
      }
    },
    [stepIndex, steps.length, dispatch, environmentName, domainName, projectId]
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
        {!isFetching && !newEnvironmentId && (
          <>
            <Box>
              <h1 id="new-environment-form-title">Add New Environment</h1>
              <form id="new-environment-form" onSubmit={onNextButtonPressed}>
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

        {!isFetching && newEnvironmentId && (
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
                <WebSdkCodeSnippet environmentId={newEnvironmentId} />
              </Box>
              <Box marginTop={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addNewEnvironmentCompleted()}
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
