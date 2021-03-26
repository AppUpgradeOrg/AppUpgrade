import React from 'react';
import { Loading } from './Loading';
import { Login } from './Login';
import { EnvironmentsPage } from './ProjectsPage';
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
  PROJECTS: '/projects',
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
    name: 'environments',
    path: ROUTES.PROJECTS,
    protected: true,
    exact: true,
    navigation: {
      label: 'Environments',
      links: ['environments']
    },
    component: () => {
      return <EnvironmentsPage />;
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
