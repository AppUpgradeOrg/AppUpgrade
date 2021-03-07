import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { configureTestWrapper } from './test-utils';
import { AppUser } from './types';

test('<ProtectedRoute /> displays protected content when user is logged in', () => {
  const protectedContent = 'Me so private';

  render(<ProtectedRoute path="/private">{protectedContent}</ProtectedRoute>, {
    wrapper: configureTestWrapper({
      onAuthStateChangedResult: { email: 'user@example.com' } as AppUser
    })
  });

  expect(screen.getByText(protectedContent)).toBeTruthy();
});

test('<ProtectedRoute /> redirects to login page if user is not logged in', () => {
  const history = createMemoryHistory();
  history.push('/private');

  render(
    <Router history={history}>
      <Switch>
        <Route path="/login">
          <div>Login Page</div>
        </Route>
        <ProtectedRoute path="/private">Should not render</ProtectedRoute>
      </Switch>
    </Router>,
    {
      wrapper: configureTestWrapper({
        onAuthStateChangedResult: null
      })
    }
  );

  expect(history.location.pathname).toBe('/login');
  expect(screen.getByText('Login Page')).toBeTruthy();
});

test('<ProtectedRoute /> displays loading spinner while user is being fetched', async () => {
  jest.useFakeTimers();

  const updateAuthUserPromise = new Promise<AppUser>((resolve) => {
    setTimeout(() => {
      resolve({ email: 'ryan@gmail.com' } as AppUser);
    });
  });

  render(
    <ProtectedRoute path="/private">
      Should render after user resolved
    </ProtectedRoute>,
    {
      wrapper: configureTestWrapper({
        authOverrides: {
          onAuthStateChanged: (cb: (a: AppUser | null) => any) => {
            updateAuthUserPromise.then(cb);
            return () => {};
          }
        }
      })
    }
  );

  expect(screen.getByText('Loading')).toBeTruthy();
  await screen.findByText('Should render after user resolved');
});
