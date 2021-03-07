import { ThemeProvider } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { FirebaseAuthService } from './auth/auth.service';
import { Environment } from './env';
import { FirebaseApiClient } from './firebase/firebase-api-client';
import { firebaseConf } from './firebase/firebase.conf';
import { configureFirebaseApp } from './firebase/firebase.service';
import { NavigationBar } from './NavigationBar';
import { ProtectedRoute } from './protected-route';
import { AppRoute, appRoutes } from './routes';
import { configureAppStore } from './store';
import { theme } from './theme';

// Bootstrap services
const environment = new Environment();
const firebaseApp = configureFirebaseApp(firebaseConf(environment));
const firebaseApiClient = new FirebaseApiClient(firebaseApp);
const firebaseAuthService = new FirebaseAuthService(firebaseApp);

const store = configureAppStore(firebaseApiClient, firebaseAuthService);

export function App() {
  const [appRoute, setAppRoute] = useState<AppRoute | undefined>(undefined);

  return (
    <React.Fragment>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <NavigationBar appRoute={appRoute} />
            <Switch>
              {appRoutes.map((appRoute) => {
                if (appRoute.protected) {
                  return (
                    <ProtectedRoute
                      exact={appRoute.exact}
                      key={appRoute.name}
                      path={appRoute.path}
                    >
                      <AppRouteWrapper
                        appRoute={appRoute}
                        onRouted={(route) => setAppRoute(route)}
                      />
                    </ProtectedRoute>
                  );
                } else {
                  return (
                    <Route
                      exact={appRoute.exact}
                      key={appRoute.name}
                      path={appRoute.path}
                    >
                      <AppRouteWrapper
                        appRoute={appRoute}
                        onRouted={(route) => setAppRoute(route)}
                      />
                    </Route>
                  );
                }
              })}
            </Switch>
          </Router>
        </ThemeProvider>
      </Provider>
    </React.Fragment>
  );
}

export const AppRouteWrapper: FC<{
  appRoute: AppRoute;
  onRouted: (appRoute: AppRoute) => void;
}> = ({ appRoute, onRouted }) => {
  useEffect(() => {
    onRouted(appRoute);
  }, [appRoute, onRouted]);
  return <>{appRoute.component()}</>;
};
