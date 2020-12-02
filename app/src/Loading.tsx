import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import { initializeUser } from "./auth/auth.slice";
import { app } from './firebase/firebase.service';
import { RootState } from "./root-reducer";
export const Loading: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(( state: RootState) => {
    return state.auth.user;
  })

  useEffect(useCallback(() => {
    dispatch(initializeUser());
  }, [dispatch]), []);

  return (
    <div>
      {user === undefined && <>Loading</>}
      {user === null && <>No User</>}
      {user && (
        <Redirect to="/private" />
      )}
    </div>
  );
}