import { Box, Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { LoadingSpinner } from './LoadingSpinner';
import {
  ModalBody,
  MODAL_PADDING_UNITS,
  MODAL_WIDTH_PIXELS
} from './ModalBody';
import { onboardNewUser } from './onboarding/onboarding.slice';
import { RootState } from './root-reducer';
import { ROUTES } from './routes';
import { RequestState } from './types';
import { WebSdkCodeSnippet } from './WebSdkCodeSnippet';

const useStyles = makeStyles((theme) => ({
  codeContainer: {
    maxWidth: `calc(${MODAL_WIDTH_PIXELS}px - ${
      theme.spacing(MODAL_PADDING_UNITS) * 2
    }px)`
  }
}));

export type OnboardingFormProps = {
  onOnboardingCompleted: () => void;
};

export const OnboardingForm: FC<OnboardingFormProps> = ({
  onOnboardingCompleted
}) => {
  const dispatch = useDispatch();
  const [organizationName, setOrganizationName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [environmentName, setEnvironmentName] = useState('');
  const [domainName, setDomainName] = useState('');

  const [stepIndex, setStepIndex] = useState(0);
  const [bootstrapping, setBootstrapping] = useState(false);
  const classes = useStyles();

  const {
    projects,
    bootstrappedFirstEnvironmentId,
    onboardNewUserRequestState
  } = useSelector((rootState: RootState) => {
    return {
      projects: rootState.projects.projects,
      bootstrappedFirstEnvironmentId: rootState.onboarding.firstEnvironmentId,
      onboardNewUserRequestState:
        rootState.onboarding.onboardNewUserRequestState
    };
  });

  const steps = useMemo(() => {
    return [
      {
        component: (
          <Box>
            <Typography variant="h6">
              What is the name of your organization?
            </Typography>
            <Box marginTop={1}>
              <TextField
                required
                value={organizationName}
                autoFocus
                onChange={(e) => setOrganizationName(e.target.value)}
                id="organization-name"
                label="Organization name"
              />
            </Box>
          </Box>
        ),
        isValid: () => {
          return organizationName.length > 0;
        }
      },
      {
        component: (
          <Box>
            <Typography variant="h6">
              What do you want to name your first project?
            </Typography>
            <TextField
              required
              value={projectName}
              autoFocus
              onChange={(e) => setProjectName(e.target.value)}
              id="first-project-name"
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
              What do you want to name your first environment?
            </Typography>
            <TextField
              required
              value={environmentName}
              autoFocus
              onChange={(e) => setEnvironmentName(e.target.value)}
              id="first-environment-name"
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
              id="first-domain-name"
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
  }, [domainName, environmentName, organizationName, projectName]);

  const onNextButtonPressed = useCallback(
    (event: React.MouseEvent | React.FormEvent) => {
      event.stopPropagation();
      event.preventDefault();

      if (stepIndex === steps.length - 1) {
        dispatch(
          onboardNewUser(
            organizationName,
            projectName,
            environmentName,
            domainName
          )
        );
        setBootstrapping(true);
      } else {
        setStepIndex(stepIndex + 1);
      }
    },
    [
      stepIndex,
      steps.length,
      dispatch,
      organizationName,
      projectName,
      environmentName,
      domainName
    ]
  );

  const onBackButtonPressed = useCallback(() => {
    setStepIndex(stepIndex - 1);
  }, [stepIndex, setStepIndex]);

  if (!bootstrapping && projects.length > 0) {
    return <Redirect to={ROUTES.PROJECTS} />;
  }

  const body = (
    <ModalBody>
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent={bootstrapping ? 'flex-start' : 'space-between'}
      >
        {!bootstrapping && (
          <>
            <Box>
              <h1 id="onboarding-form-title">Welcome to AppUpgrade</h1>
              <p id="onboarding-form-description">
                Let's get started by setting up your account
              </p>
              <form id="onboarding-form" onSubmit={onNextButtonPressed}>
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

        {onboardNewUserRequestState === RequestState.FETCHING && (
          <>
            <Box marginTop={8}>
              <LoadingSpinner />
            </Box>
          </>
        )}

        {bootstrappedFirstEnvironmentId && (
          <>
            <Box>
              <Typography variant="h6">
                Awesome, you've setup your first project with your first
                environment.
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
                  environmentId={bootstrappedFirstEnvironmentId}
                />
              </Box>
              <Box marginTop={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onOnboardingCompleted()}
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
