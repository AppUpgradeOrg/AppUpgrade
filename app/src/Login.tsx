import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "./auth/auth.slice";
import { TextField, Button, FormHelperText, Container, Grid } from '@material-ui/core';
import { app } from './firebase/firebase.service'
import { makeStyles } from "@material-ui/core/styles";

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
  const classes = useStyles();
  const dispatch = useDispatch();
  let history = useHistory();

  const [formState, setFormState] = useState <{email: string, password: string, error: string}>({
    email: '',
    password: '',
    error: ''
  });

const loginUser = async () => {
  console.log('form submitted');
  try {
    const credential = await app.auth().signInWithEmailAndPassword(formState.email, formState.password);
    console.log('credential: ', credential);
    if (credential) {
      await dispatch(setAuthenticated({ isAuthenticated: true }));
      history.push('/private');
    }
  } catch (err) {
    setFormState({...formState, error: 'Incorrect, email or password'})
  }
}

const handleChange = (e: React.ChangeEvent < HTMLInputElement >) => {
  const { name, value } = e.target;
  setFormState({
    ...formState,
    [name]: value
  });
};

  return (
    <Container className={classes.root}>
      <div>
      <h1>Login</h1>
      <form>
      <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField 
        required 
        fullWidth={true}
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
          {formState.error}
          </FormHelperText>
        <Button 
        className={classes.loginButton}
        variant="contained" 
        color="primary"
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

