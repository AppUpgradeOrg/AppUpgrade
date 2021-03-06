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
  newUser,
  resetNewUserTransientValues,
  resetSignUpErrors
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
  signupButton: {
    margin: '20px'
  }
}));

export const Signup: FC = () => {
  const {
    user,
    signUpUserErr,
    signUpPasswordErr,
    newUserRequestState
  } = useSelector((state: RootState) => {
    return {
      user: state.auth.user,
      signUpUserErr: state.auth.signUpUserErr,
      signUpPasswordErr: state.auth.signUpPasswordErr,
      newUserRequestState: state.auth.newUserRequestState
    };
  });

  const classes = useStyles();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState<{
    email: string;
    password: string;
  }>({
    email: '',
    password: ''
  });

  const createNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(newUser(formState.email, formState.password));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const resetErrors = () => {
    dispatch(resetSignUpErrors());
  };

  useEffect(() => {
    return () => {
      dispatch(resetNewUserTransientValues());
    };
  }, [dispatch]);

  if (user) {
    if (newUserRequestState !== RequestState.INITIAL) {
      return (
        <Redirect
          to={{ pathname: ROUTES.PROJECTS, search: '?onboarding=true' }}
        />
      );
    } else {
      return <Redirect to={ROUTES.PROJECTS} />;
    }
  }

  return (
    <Container className={classes.root}>
      <Box marginTop="120px">
        <Box marginBottom="50px">
          <Typography variant="h4">Create an account</Typography>
        </Box>
        <form onFocus={resetErrors} onSubmit={createNewUser}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth={true}
                error={!!signUpUserErr}
                label="Email"
                name="email"
                type="email"
                disabled={newUserRequestState === RequestState.FETCHING}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth={true}
                error={!!signUpPasswordErr}
                label="Password"
                name="password"
                type="password"
                disabled={newUserRequestState === RequestState.FETCHING}
                onChange={handleChange}
              />
              <FormHelperText className={classes.formHelperText}>
                {signUpPasswordErr || signUpUserErr}
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.signupButton}
                variant="contained"
                color="primary"
                type="submit"
                disabled={newUserRequestState === RequestState.FETCHING}
                onClick={createNewUser}
              >
                Signup
              </Button>
              <Button color="primary" component={Link} to={ROUTES.LOGIN}>
                Already have an account?
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};
