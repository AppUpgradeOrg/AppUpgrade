import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { initializeUser } from './auth/auth.slice';
import { RootState } from './root-reducer';

export const ProtectedRoute: FC<{ path: string }> = ({ children }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => {
    return state.auth.user;
  });

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  if (user === undefined) {
    return <>Loading</>;
  }

  if (user === null) {
    return <Redirect to="/login" />;
  }

  if (user) {
    return children;
  }
};
