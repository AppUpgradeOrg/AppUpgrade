import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '65px',
    minHeight: 'calc(100vh - 65px)',
    display: 'flex',
    flexDirection: 'column'
  }
}));

export const Main: FC = ({ children }) => {
  const classes = useStyles();
  return <main className={classes.root}>{children}</main>;
};
