import { Grid } from '@material-ui/core';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { initializeUser } from './auth/auth.slice';
import { LoadingSpinner } from './LoadingSpinner';
import { RootState } from './root-reducer';
import { ROUTES } from './routes';
export const Loading: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => {
    return state.auth.user;
  });

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  return (
    <>
      {user === undefined && (
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{ height: '100vh' }}
        >
          <Grid item xs={12}>
            <LoadingSpinner />
          </Grid>
        </Grid>
      )}
      {user === null && <Redirect to={ROUTES.LOGIN} />}
      {user && <Redirect to={ROUTES.PROJECTS} />}
    </>
  );
};
