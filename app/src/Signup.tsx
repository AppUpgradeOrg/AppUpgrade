import React, { FC, useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import { newUser } from "./auth/auth.slice";
import { TextField, Button, FormHelperText, Grid, Container } from '@material-ui/core';
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
  signupButton: {
    margin: '20px'
  }
}));

export const Signup: FC = () => {
  const user = useSelector((state: RootState) => {
    return state.auth.user
  })
  const signUpUserErr = useSelector((state: RootState) => {
    return state.auth.signUpUserErr
  })
  const signUpPasswordErr = useSelector((state: RootState) => {
    return state.auth.signUpPasswordErr
  })
  const classes = useStyles();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState <{email: string, password: string}>({
    email: '',
    password: ''
  });
  
  const createNewUser = async () => {
    dispatch(newUser(formState.email, formState.password));
  }

  const handleChange = (e: React.ChangeEvent < HTMLInputElement >) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  if (user) {
    <Redirect to='/private' />
  }

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
            error={signUpUserErr ? true : false}
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
            error={signUpPasswordErr ? true : false}
            id="standard-required" 
            label="Password"
            name="password"
            type="password"
            onChange={handleChange} 
            />
            <FormHelperText 
            className={classes.formHelperText}>
            {signUpPasswordErr || signUpUserErr}
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