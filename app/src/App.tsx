import React from 'react';
import { Route, BrowserRouter as Router, Switch} from "react-router-dom";
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { Signup } from './Signup';
import { Login } from './Login';
import { Private } from './Private';
import { Loading } from './Loading';
import { ProtectedRoute } from './protected-route';

function App() {
  return (
    <Provider store={store} >
      <Router>
        <Switch>
          <Route path="/signup">
            <div className="App">
              <Signup />
            </div>
          </Route>
          <Route path="/login">
            <div className="App">
              <Login/>
            </div>
          </Route>
          <ProtectedRoute path='/private'>
            <Private/>
          </ProtectedRoute>
          <Route path="/">
              {/* Home */}
              <Loading />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
