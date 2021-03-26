import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { setSignInRequestState } from './auth/auth.slice';
import { Login } from './Login';
import { ROUTES } from './routes';
import { configureTestWrapper } from './test-utils';
import { RequestState } from './types';

/// Helpers

const getEmailInput = () =>
  screen.getByLabelText('Email', {
    exact: false
  }) as HTMLInputElement;

const getPasswordInput = () =>
  screen.getByLabelText('Password', {
    exact: false
  }) as HTMLInputElement;

const getLoginButton = () =>
  screen.getByRole('button', { name: 'Login' }) as HTMLButtonElement;

/// Tests

test('<Login /> redirects to Environments Page on successful login', async () => {
  const history = createMemoryHistory();
  history.push(ROUTES.LOGIN);

  render(
    <Router history={history}>
      <Switch>
        <Route path={ROUTES.LOGIN}>
          <Login />
        </Route>
        <Route path={ROUTES.PROJECTS}>
          <div>Projects Page</div>
        </Route>
      </Switch>
    </Router>,
    {
      wrapper: configureTestWrapper({
        signInWithEmailAndPasswordResult: { email: 'ryan@gmail.com' }
      })
    }
  );

  const emailInput = getEmailInput();
  const passwordInput = getPasswordInput();
  const loginButton = getLoginButton();

  fireEvent.change(emailInput, { target: { value: 'ryan@gmail.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });

  fireEvent.click(loginButton);
  await waitFor(() => screen.getByText('Projects Page'));
  expect(history.location.pathname).toBe(ROUTES.PROJECTS);
});

test('<Login /> displays error when login unsuccessful', async () => {
  const history = createMemoryHistory();
  history.push(ROUTES.LOGIN);

  render(
    <Router history={history}>
      <Switch>
        <Route path={ROUTES.LOGIN}>
          <Login />
        </Route>
        <Route path={ROUTES.PROJECTS}>
          <div>Projects Page</div>
        </Route>
      </Switch>
    </Router>,
    {
      wrapper: configureTestWrapper({
        authOverrides: {
          signInWithEmailAndPassword: async (email, password) => {
            throw new Error('Failed to authenticated');
          }
        }
      })
    }
  );

  const emailInput = getEmailInput();
  const passwordInput = getPasswordInput();
  const loginButton = getLoginButton();

  fireEvent.change(emailInput, { target: { value: 'ryan@gmail.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });
  fireEvent.click(loginButton);

  await waitFor(() => screen.getByText('Incorrect, email or password'));

  fireEvent.focus(emailInput); // should remove error message

  expect(screen.queryByText('Incorrect, email or password')).toBeFalsy();
});

test('<Login /> disables login button when signing in', async () => {
  const history = createMemoryHistory();
  history.push(ROUTES.LOGIN);

  const Wrapper = configureTestWrapper({
    authOverrides: {
      signInWithEmailAndPassword: async (email, password) => {
        throw new Error('Failed to authenticated');
      }
    }
  });

  const { store } = Wrapper;

  render(
    <Router history={history}>
      <Switch>
        <Route path={ROUTES.LOGIN}>
          <Login />
        </Route>
        <Route path={ROUTES.PROJECTS}>
          <div>Projects Page</div>
        </Route>
      </Switch>
    </Router>,
    {
      wrapper: Wrapper
    }
  );

  const loginButton = getLoginButton();

  store.dispatch(
    setSignInRequestState({ signInRequestState: RequestState.INITIAL })
  );

  expect(loginButton.disabled).toBe(false);

  store.dispatch(
    setSignInRequestState({ signInRequestState: RequestState.FETCHING })
  );

  expect(loginButton.disabled).toBe(true);
});
