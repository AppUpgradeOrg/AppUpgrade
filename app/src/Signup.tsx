import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch} from "react-redux";
import { setAuthenticated } from "./auth/auth.slice";
import { app } from './firebase/firebase.service'
import { TextField, Button, FormHelperText, Grid, Container } from '@material-ui/core';
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
  signupButton: {
    margin: '20px'
  }
}));

app.auth().onAuthStateChanged((u) => {
  console.log("Changed", u)
})

export const Signup: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let history = useHistory();

  const [formState, setFormState] = useState <{email: string, password: string, error: string}>({
    email: '',
    password: '', 
    error: ''
  });
  
  const createNewUser = async () => {
    try {
      const user = await app.auth().createUserWithEmailAndPassword(formState.email, formState.password)
      if (user) {
        dispatch(setAuthenticated({ isAuthenticated: true }));
        history.push('/private');
      }
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setFormState({...formState, error: 'Looks like you already have an account. Click Login.'});
          break;
        case 'auth/invalid-email':
          setFormState({...formState, error: 'Please enter a valid email'});
          break;
        case 'auth/weak-password':
          setFormState({...formState, error: 'Password must be at least 6 characters'});
          break;
        default:
          break;
      }
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
      <h1>Create an account</h1>
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
            <FormHelperText 
            className={classes.formHelperText}>
            {formState.error}
            </FormHelperText>  
          </Grid>
          <Grid item xs={12}>
            <Button 
            className={classes.signupButton}
            variant="contained" 
            color="primary"
            onClick={createNewUser}
            >
              Signup
            </Button>
            <a href='/login'>Already have an account?</a>
          </Grid>
        </Grid>
      </form>
      </div>
    </Container>
  )
}