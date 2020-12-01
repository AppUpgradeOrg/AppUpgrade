import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "./auth/auth.slice";
import { RootState } from "./root-reducer";
import { app } from './firebase/firebase.service'
app.auth().onAuthStateChanged((u) => {
  console.log("Changed", u)
})

export const AuthPlayground: FC = () => {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state: RootState) => {
    return {
      isAuthenticated: state.auth.isAuthenticated
    }
  })

  const toggleAuthenticated = async () => {
    dispatch(setAuthenticated({ isAuthenticated: !isAuthenticated }));
    // console.log(app.auth().currentUser);
    // app.auth().onAuthStateChanged((u) => console.log(u))
    // const credential = await app.auth().signInWithEmailAndPassword("ryanspillsbury90@gmail.com", "HelloWorld1!")
    console.log(app.auth().currentUser);
  }

  return (
    <div>
      Is Authenticated: {isAuthenticated ? "true" : "false"}
      <button onClick={toggleAuthenticated}>
        Change state
      </button>
    </div>
  )
}