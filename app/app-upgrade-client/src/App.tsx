import { Box, ThemeProvider } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { FirebaseAuthService } from './auth/auth.service';
import { fetchConf } from './conf/conf.slice';
import { Environment } from './env';
import { FirebaseApiClient } from './firebase/firebase-api-client';
import { firebaseConf } from './firebase/firebase.conf';
import { configureFirebaseApp } from './firebase/firebase.service';
import { LoadingSpinner } from './LoadingSpinner';
import { NavigationBar } from './NavigationBar';
import { ProtectedRoute } from './protected-route';
import { RootState } from './root-reducer';
import { AppRoute, appRoutes } from './routes';
import { configureAppStore } from './store';
import { theme } from './theme';

// Bootstrap services
const environment = new Environment();
const firebaseApp = configureFirebaseApp(firebaseConf(environment));
const firebaseApiClient = new FirebaseApiClient(firebaseApp);
const firebaseAuthService = new FirebaseAuthService(firebaseApp);

const store = configureAppStore(firebaseApiClient, firebaseAuthService);
store.dispatch(fetchConf());

export function App() {
  const [appRoute, setAppRoute] = useState<AppRoute | undefined>(undefined);

  return (
    <React.Fragment>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ConfAwaiter>
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
          </ConfAwaiter>
        </ThemeProvider>
      </Provider>
    </React.Fragment>
  );
}

export const ConfAwaiter: FC = ({ children }) => {
  const { conf } = useSelector((rootState: RootState) => {
    return {
      conf: rootState.conf.conf
    };
  });

  if (conf) {
    return <>{children}</>;
  } else {
    return (
      <Box marginTop={50}>
        <LoadingSpinner />
      </Box>
    );
  }
};

export const AppRouteWrapper: FC<{
  appRoute: AppRoute;
  onRouted: (appRoute: AppRoute) => void;
}> = ({ appRoute, onRouted }) => {
  useEffect(() => {
    onRouted(appRoute);
  }, [appRoute, onRouted]);
  return <>{appRoute.component()}</>;
};
