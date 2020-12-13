import React, { FC, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RequestState, resetSignInErrors, resetSignInTransientValues, signInUser } from "./auth/auth.slice";
import { TextField, Button, FormHelperText, Container, Grid } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { RootState } from "./root-reducer";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    "& h2": {
      textAlign: "center"
    },
    maxWidth: "600px"
  },
  formHelperText: {
    color: '#ff6961'
  },
  loginButton: {
    margin: '20px'
  }
}));

export const Login: FC = () => {
  const { user, signInError, signInRequestState } = useSelector((state: RootState) => {
    return {
      user: state.auth.user,
      signInError: state.auth.signInError,
      signInRequestState: state.auth.signInRequestState
    }
  })

  const classes = useStyles();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState <{email: string, password: string}>({
    email: '',
    password: ''
  });

const loginUser = (e: React.FormEvent) => {
  e.preventDefault()
  dispatch(signInUser(formState.email, formState.password));
}

const handleChange = (e: React.ChangeEvent < HTMLInputElement >) => {
  const { name, value } = e.target;
  setFormState({
    ...formState,
    [name]: value
  });
};

const resetErrors = () => {
  dispatch(resetSignInErrors());
}

useEffect(() => {
  return () => {
    dispatch(resetSignInTransientValues());
  }
}, [])

  if (user) {
    return <Redirect to='/private' />
  }

  return (
    <Container className={classes.root}>
      <div>
      <h1>Login</h1>
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
            disabled={signInRequestState === RequestState.FETCHING}
            onChange={handleChange}
            />
            </Grid>
            <Grid item xs={12}>
              <FormHelperText
              className={classes.formHelperText}>
              {signInError}
              </FormHelperText>
            <Button
            className={classes.loginButton}
            variant="contained"
            color="primary"
            type='submit'
            disabled={signInRequestState === RequestState.FETCHING}
            onClick={loginUser}
            >
              Login
            </Button>
              <Link to="/signup">New user? Create an account.</Link>
            </Grid>
          </Grid>
    </form>
    </div>
    </Container>
  )

}

