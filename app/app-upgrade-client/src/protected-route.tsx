import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { initializeUser } from './auth/auth.slice';
import { LoadingSpinner } from './LoadingSpinner';
import { Main } from './Main';
import { RootState } from './root-reducer';
import { ROUTES } from './routes';

type RoutePropTypes = Route['props'];

export const ProtectedRoute: FC<RoutePropTypes> = ({ children }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => {
    return state.auth.user;
  });

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  if (user === undefined) {
    return (
      <Main>
        <LoadingSpinner />
      </Main>
    );
  }

  if (user === null) {
    return <Redirect to={ROUTES.LOGIN} />;
  }

  if (user) {
    return <Main>{children}</Main>;
  }

  throw new Error('Missing Case Exception');
};
