import { Button, Container, Modal } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import { signOutUser } from './auth/auth.slice';
import { OnboardingForm } from './onboarding-form';
import { RootState } from './root-reducer';

export const Dashboard: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { projects } = useSelector((rootState: RootState) => {
    return { projects: rootState.projects.projects };
  });

  const [hasProjects] = useState(projects.length);
  const [isOnboarding, setOnboarding] = useState(
    Boolean(params.get('onboarding'))
  );

  const logoutUser = () => {
    dispatch(signOutUser());
  };

  if (!isOnboarding && Boolean(params.get('onboarding'))) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <Container>
        <div>Dashboard</div>
        <Button variant="contained" color="primary" onClick={logoutUser}>
          Logout
        </Button>
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
