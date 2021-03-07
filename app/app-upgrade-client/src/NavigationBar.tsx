import {
  AppBar,
  Button,
  IconButton,
  Link,
  List,
  Menu,
  MenuItem,
  Toolbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { signOutUser } from './auth/auth.slice';
import logo from './images/app-upgrade-logo-white.svg';
import { RootState } from './root-reducer';
import { AppRoute, appRoutes, ROUTES } from './routes';
import { theme } from './theme';

export const TEST_ID = 'navigation-bar';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    position: 'relative'
  },
  navLogo: {
    height: 40,
    width: 'auto'
  }
}));

export const NavigationBar: FC<{ appRoute?: AppRoute }> = ({ appRoute }) => {
  const classes = useStyles();

  // Hide the navigation bar if we don't know the appRoute is not.
  if (!appRoute) {
    return null;
  }

  // Hide the navigation bar if its a non-protected route without any links in the navigation bar
  if (appRoute.navigation.links.length === 0 && !appRoute.protected) {
    return null;
  }

  return (
    <>
      <AppBar
        data-testid={TEST_ID}
        position="relative"
        style={{
          position: 'fixed',
          top: 0
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
              <Link
                to={ROUTES.DASHBOARD}
                underline="none"
                component={RouterLink}
              >
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
          <List component="nav" aria-labelledby="main navigation">
            {appRoute && appRoute.navigation.links.length > 0
              ? appRoute.navigation.links.map((link) => {
                  const linkRef = appRoutes.find((ar) => ar.name === link);
                  if (!linkRef) throw new Error(`Invalid Link ${link}`);

                  return (
                    <Button
                      key={`${linkRef.name}`}
                      to={linkRef.path}
                      component={RouterLink}
                      style={{ color: theme.palette.primary.contrastText }}
                    >
                      {linkRef.navigation.label}
                    </Button>
                  );
                })
              : null}
            {appRoute && appRoute.protected ? <ProfileMenuDropdown /> : null}
          </List>
        </Toolbar>
      </AppBar>
    </>
  );
};

const ProfileMenuDropdown: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => {
    return {
      user: state.auth.user
    };
  });

  const openProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = () => {
    handleClose();
    dispatch(signOutUser());
  };

  return (
    <>
      {user ? (
        <>
          <IconButton
            style={{ color: theme.palette.common.white }}
            aria-controls="profile-menu"
            aria-haspopup="true"
            aria-label="profile menu"
            onClick={openProfileMenu}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </Menu>
        </>
      ) : null}
    </>
  );
};
