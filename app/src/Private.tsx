import { Button } from "@material-ui/core";
import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { signOutUser } from "./auth/auth.slice";

export const Private: FC = () => {
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(signOutUser());
  };

  return (
    <>
      <div>You have reached a private page</div>
      <Button variant="contained" color="primary" onClick={logoutUser}>
        Logout
      </Button>
    </>
  );
};
