import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { setUser } from './auth/auth.slice';
import { NavigationBar, TEST_ID } from './NavigationBar';
import { appRoutes } from './routes';
import { configureTestWrapper } from './test-utils';

test('<NavigationBar /> is not displayed when appRoute is not set', () => {
  render(<NavigationBar appRoute={undefined} />);

  const navigationBarElement = screen.queryByTestId(TEST_ID);

  expect(navigationBarElement).toBeNull();
});

test('<NavigationBar /> is not displayed for unprotected app route without navigation links', () => {
  const unprotectedAppRouteWithoutLinks = appRoutes.find((route) => {
    return !route.protected && route.navigation.links.length === 0;
  });

  /// Assert test invariants

  if (!unprotectedAppRouteWithoutLinks)
    throw new Error('Could not find signup app route');

  render(<NavigationBar appRoute={unprotectedAppRouteWithoutLinks} />);

  const navigationBarElement = screen.queryByTestId(TEST_ID);

  expect(navigationBarElement).toBeNull();
});

test('<NavigationBar /> displays links for protected route with links', () => {
  const protectedAppRouteWithLinks = appRoutes.find(
    (route) => route.protected && route.navigation.links.length > 0
  );

  /// Assert test invariants

  if (!protectedAppRouteWithLinks)
    throw new Error('Could not find protected app route with links');

  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <NavigationBar appRoute={protectedAppRouteWithLinks} />
    </Router>,
    {
      wrapper: configureTestWrapper({
        onAuthStateChangedResult: null
      })
    }
  );

  protectedAppRouteWithLinks.navigation.links.forEach((navigationLink) => {
    const referencedNavigationLink = appRoutes.find(
      (ar) => ar.name === navigationLink
    );
    const environmentsPageNavigationLink = screen.getByRole('button', {
      name: referencedNavigationLink?.navigation.label
    });

    expect(environmentsPageNavigationLink).toHaveAttribute(
      'href',
      referencedNavigationLink?.path
    );
  });
});

test('<NavigationBar /> displays profile menu with logout menu item for protected app routes when user is logged in', () => {
  const protectedAppRoute = appRoutes.find((route) => route.protected);

  /// Assert test invariants

  if (!protectedAppRoute) throw new Error('Could not find protected app route');

  const history = createMemoryHistory();

  const signOutMock = jest.fn();
  const Wrapper = configureTestWrapper({
    authOverrides: {
      signOut: signOutMock
    }
  });

  const { store } = Wrapper;

  store.dispatch(
    setUser({
      user: { email: 'ryan@gmail.com' }
    })
  );

  render(
    <Router history={history}>
      <NavigationBar appRoute={protectedAppRoute} />
    </Router>,
    {
      wrapper: Wrapper
    }
  );

  const profileMenu = screen.getByRole('button', {
    name: 'profile menu'
  });

  fireEvent.click(profileMenu);

  const logoutMenuItem = screen.getByRole('menuitem', {
    name: 'Logout'
  });

  fireEvent.click(logoutMenuItem);

  expect(signOutMock).toHaveBeenCalled();
});
