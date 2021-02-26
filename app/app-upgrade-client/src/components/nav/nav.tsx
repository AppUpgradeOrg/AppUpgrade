import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { signOutUser } from '../../auth/auth.slice';
import logo from '../../images/app-upgrade-logo-white.svg';
import { RootState } from '../../root-reducer';
import { appLinks } from './appLinks';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
    position: 'relative'
  },
  navLogo: {
    height: 40,
    width: 'auto'
  },
  menuLinks: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  menuButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  menuButtonLink: {
    marginRight: theme.spacing(2),
    display: 'inline-block',
    fontSize: '18px',
    color: theme.palette.primary.contrastText,
    '&:hover': {
      cursor: 'pointer',
      color: '#F5F5F5'
    }
  },
  menuButtonUser: {
    marginLeft: theme.spacing(4)
  },
  closeMenuButton: {
    marginRight: 'auto',
    marginLeft: 0
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  logoutLoginDrawerWrapper: {
    padding: '8px 16px',

    '& button': {
      marginLeft: '0px !important'
    }
  }
}));

export const Nav: FC = () => {
  const { pathname } = useLocation();
  const { user } = useSelector((state: RootState) => {
    return {
      user: state.auth.user
    };
  });
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const logoutUser = () => {
    dispatch(signOutUser());
  };

  const logoutLogin = (
    <>
      {user ? (
        <Link href="/" underline="none">
          <Button
            variant="contained"
            color="secondary"
            onClick={logoutUser}
            className={classes.menuButtonUser}
          >
            Logout
          </Button>
        </Link>
      ) : (
        <Link href="/login" underline="none">
          <Button
            variant="contained"
            color="secondary"
            className={classes.menuButtonUser}
          >
            Login
          </Button>
        </Link>
      )}
    </>
  );

  const drawer = (
    <div>
      <List>
        {appLinks.map(({ label, url }) => (
          <ListItem button key={label} onClick={toggleMobileMenu}>
            <Link href={url} underline="none">
              <ListItemText primary={label} />
            </Link>
          </ListItem>
        ))}
        {pathname !== '/login' && (
          <>
            <Divider />
            <div className={classes.logoutLoginDrawerWrapper}>
              {logoutLogin}
            </div>
          </>
        )}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <IconButton
          onClick={toggleMobileMenu}
          className={classes.closeMenuButton}
        >
          <CloseIcon />
        </IconButton>
        {drawer}
      </Drawer>
      <AppBar
        position="relative"
        style={{
          position: 'fixed'
        }}
      >
        <Toolbar>
          <div className={classes.title}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center'
              }}
            >
              <Link href="/" underline="none">
                <div style={{ padding: '10px' }}>
                  <img
                    src={logo}
                    width="100px"
                    className={classes.navLogo}
                    alt="Brand Logo"
                  />
                </div>
              </Link>
            </div>
          </div>
          <List
            component="nav"
            aria-labelledby="main navigation"
            className={classes.menuLinks}
          >
            {appLinks.map(({ label, url }) => {
              return (
                <Link href={url} key={`drawer_${label}`} underline="none">
                  <Typography
                    variant="h6"
                    className={classes.menuButtonLink}
                    style={{ color: pathname === url ? '#e0e0e0' : '' }} //should rely on color palette
                  >
                    {label.toUpperCase()}
                  </Typography>
                </Link>
              );
            })}
            {pathname !== '/login' && logoutLogin}
          </List>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={toggleMobileMenu}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
