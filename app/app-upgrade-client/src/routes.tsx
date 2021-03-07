import React from 'react';
import { Dashboard } from './dashboard';
import { Loading } from './Loading';
import { Login } from './Login';
import { Signup } from './Signup';

export type AppRoute = {
  name: string;
  path: string;
  protected: boolean;
  exact: boolean;
  navigation: {
    label?: string;
    links: string[];
  };
  component: () => JSX.Element;
};

export const ROUTES = {
  SIGN_UP: '/signup',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LOADING: '/'
};

export const appRoutes: AppRoute[] = [
  {
    name: 'signup',
    path: ROUTES.SIGN_UP,
    protected: false,
    exact: true,
    navigation: {
      label: 'Signup',
      links: []
    },
    component: () => {
      return (
        <div className="App">
          <Signup />
        </div>
      );
    }
  },
  {
    name: 'login',
    path: ROUTES.LOGIN,
    protected: false,
    exact: true,
    navigation: {
      label: 'Login',
      links: []
    },
    component: () => {
      return (
        <div className="App">
          <Login />
        </div>
      );
    }
  },
  {
    name: 'dashboard',
    path: ROUTES.DASHBOARD,
    protected: true,
    exact: true,
    navigation: {
      label: 'Dashboard',
      links: ['dashboard']
    },
    component: () => {
      return <Dashboard />;
    }
  },
  {
    name: 'loading',
    path: ROUTES.LOADING,
    protected: false,
    exact: false,
    navigation: {
      links: []
    },
    component: () => {
      return <Loading />;
    }
  }
];
