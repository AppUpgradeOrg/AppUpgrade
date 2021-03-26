import { makeStyles } from '@material-ui/core/styles';
import React, { FC } from 'react';

export const MODAL_WIDTH_PIXELS = 900;
export const MODAL_PADDING_UNITS = 3;

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: MODAL_WIDTH_PIXELS,
    maxHeight: '90vh',
    minHeight: '350px',
    overflowY: 'scroll',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(MODAL_PADDING_UNITS),
    borderRadius: '10px'
  }
}));

export const ModalBody: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div
      style={{
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -30%)',
        display: 'flex'
      }}
      className={classes.paper}
    >
      {children}
    </div>
  );
};
