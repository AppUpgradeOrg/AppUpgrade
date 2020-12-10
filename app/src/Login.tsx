import React, { FC, useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInUser } from "./auth/auth.slice";
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
  const user = useSelector((state: RootState) => {
    return state.auth.user
  })
  const signInError = useSelector((state: RootState) => {
    return state.auth.signInError
  })
  const classes = useStyles();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState <{email: string, password: string}>({
    email: '',
    password: ''
  });

const loginUser = async (e: React.FormEvent) => {
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

  if (user) {
    return <Redirect to='/private' />
  }

  return (
    <Container className={classes.root}>
      <div>
      <h1>Login</h1>
      <form onSubmit={loginUser}>
      <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
        required
        fullWidth={true}
        error={signInError ? true : false}
        id="standard-required"
        label="Email"
        name="email"
        type="email"
        onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
        required
        fullWidth={true}
        error={signInError ? true : false}
        id="standard-required"
        label="Password"
        name="password"
        type="password"
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
        onClick={loginUser}
        >
          Login
        </Button>
        <a href='/signup'>New user? Create an account.</a>
        </Grid>
        </Grid>
    </form>
    </div>
    </Container>
  )

}

