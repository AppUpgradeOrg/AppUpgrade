import {
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import {
  resetSignInErrors,
  resetSignInTransientValues,
  signInUser
} from './auth/auth.slice';
import { RootState } from './root-reducer';
import { ROUTES } from './routes';
import { RequestState } from './types';

const useStyles = makeStyles(() => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    '& h2': {
      textAlign: 'center'
    },
    maxWidth: '600px'
  },
  formHelperText: {
    color: '#ff6961'
  },
  loginButton: {
    margin: '20px'
  }
}));

export const Login: FC = () => {
  const { user, signInError, signInRequestState } = useSelector(
    (state: RootState) => {
      return {
        user: state.auth.user,
        signInError: state.auth.signInError,
        signInRequestState: state.auth.signInRequestState
      };
    }
  );

  const classes = useStyles();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState<{
    email: string;
    password: string;
  }>({
    email: '',
    password: ''
  });

  const loginUser = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signInUser(formState.email, formState.password));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const resetErrors = () => {
    dispatch(resetSignInErrors());
  };

  useEffect(() => {
    return () => {
      dispatch(resetSignInTransientValues());
    };
  }, [dispatch]);

  if (user) {
    return <Redirect to={ROUTES.PROJECTS} />;
  }

  return (
    <Container className={classes.root}>
      <Box marginTop="120px">
        <Box marginBottom="50px">
          <Typography variant="h4">Login</Typography>
        </Box>
        <form onFocus={resetErrors} onSubmit={loginUser} id="login-form">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth={true}
                error={!!signInError}
                label="Email"
                name="email"
                type="email"
                id="email"
                disabled={signInRequestState === RequestState.FETCHING}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth={true}
                error={!!signInError}
                label="Password"
                name="password"
                type="password"
                id="password"
                disabled={signInRequestState === RequestState.FETCHING}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormHelperText className={classes.formHelperText}>
                {signInError}
              </FormHelperText>
              <Button
                className={classes.loginButton}
                variant="contained"
                color="primary"
                type="submit"
                disabled={signInRequestState === RequestState.FETCHING}
                onClick={loginUser}
              >
                Login
              </Button>
              <Button color="primary" component={Link} to={ROUTES.SIGN_UP}>
                New user? Create an account?
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};
