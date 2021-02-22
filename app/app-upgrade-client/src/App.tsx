import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { Dashboard } from './dashboard';
import { Environment } from './env';
import { firebaseConf } from './firebase/firebase.conf';
import { configureFirebaseApp } from './firebase/firebase.service';
import { Loading } from './Loading';
import { Login } from './Login';
import { ProtectedRoute } from './protected-route';
import { Signup } from './Signup';
import { configureAppStore } from './store';
import { theme } from './theme';

const environment = new Environment();
const firebaseApp = configureFirebaseApp(firebaseConf(environment));
const store = configureAppStore(firebaseApp);

export function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route path="/signup">
                <div className="App">
                  <Signup />
                </div>
              </Route>
              <Route path="/login">
                <div className="App">
                  <Login />
                </div>
              </Route>
              <ProtectedRoute path="/dashboard">
                <Dashboard />
              </ProtectedRoute>
              <Route path="/">
                {/* Home */}
                <Loading />
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </Provider>
    </React.Fragment>
  );
}
