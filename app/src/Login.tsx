import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "./auth/auth.slice";
import { TextField, Button, FormHelperText } from '@material-ui/core';
import { app } from './firebase/firebase.service'

export const Login: FC = () => {
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
    <>
      <h1>Login</h1>
      <form>
      <div>
        <TextField 
        required 
        id="standard-required" 
        label="Email" 
        name="email"
        type="email"
        onChange={handleChange}
        />
      </div>
      <div>
        <TextField 
        required 
        id="standard-required" 
        label="Password"
        name="password"
        type="password"
        onChange={handleChange} 
        />
        </div>
        <div>
          <FormHelperText>{formState.error}</FormHelperText>
        <Button 
        variant="contained" 
        color="primary"
        onClick={loginUser}
        >
          Login
        </Button>
        </div>
    </form>
  </>
  )

}

