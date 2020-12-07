import React, { FC } from 'react'
import { useDispatch } from "react-redux";
import { setAuthenticated } from "./auth/auth.slice";
import { Button } from '@material-ui/core';
import { app } from './firebase/firebase.service'

export const Private: FC = () => {

  const dispatch = useDispatch();

  const logoutUser = async () => {
    await app.auth().signOut();
    await dispatch(setAuthenticated({ isAuthenticated: false }));
    console.log('user logged out');
    app.auth().onAuthStateChanged((u) => console.log(u))
  }


  return (
    <>
    <div>
      You have reached a private page
    </div>
    <Button 
      variant="contained" 
      color="primary"
      onClick={logoutUser}>
      Logout
    </Button>
    </>
  )
}
