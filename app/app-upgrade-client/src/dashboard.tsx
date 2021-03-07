import { Box, Container, Modal, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import { OnboardingForm } from './OnboardingForm';
import { RootState } from './root-reducer';
import { ROUTES } from './routes';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

export const Dashboard: FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { projects } = useSelector((rootState: RootState) => {
    return { projects: rootState.projects.projects };
  });

  const [hasProjects] = useState(projects.length);
  const [isOnboarding, setOnboarding] = useState(
    Boolean(params.get('onboarding'))
  );

  if (!isOnboarding && Boolean(params.get('onboarding'))) {
    return <Redirect to={ROUTES.DASHBOARD} />;
  }

  return (
    <>
      <Container className={classes.root}>
        <Box marginTop="40px">
          <Typography variant="h4">Dashboard</Typography>
        </Box>
      </Container>
      <Modal
        open={isOnboarding && !hasProjects}
        aria-labelledby="onboarding-form-title"
        aria-describedby="onboarding-form-description"
        onBackdropClick={() => setOnboarding(false)}
      >
        <div>
          <OnboardingForm />
        </div>
      </Modal>
    </>
  );
};
