import { Box, Container, Modal, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import { OnboardingForm } from './onboarding-form';
import { RootState } from './root-reducer';

const useStyles = makeStyles(() => ({
  root: {
    minHeight: '100vh',
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
    return <Redirect to="/dashboard" />;
  }

  return (
    <React.Fragment>
      <Container className={classes.root}>
        <Box marginTop="120px">
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
    </React.Fragment>
  );
};
