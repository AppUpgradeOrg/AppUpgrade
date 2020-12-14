import { Button, Container, Modal } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { signOutUser } from './auth/auth.slice';
import { OnboardingForm } from './onboarding-form';

export const Dashboard: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [isOnboarding] = useState(Boolean(params.get('onboarding')));
  console.log(isOnboarding);

  const logoutUser = () => {
    dispatch(signOutUser());
  };

  return (
    <>
      <Container>
        <div>Dashboard</div>
        <Button variant="contained" color="primary" onClick={logoutUser}>
          Logout
        </Button>
      </Container>
      <Modal
        open={isOnboarding}
        aria-labelledby="onboarding-form-title"
        aria-describedby="onboarding-form-description"
      >
        <div>
          <OnboardingForm />
        </div>
      </Modal>
    </>
  );
};
