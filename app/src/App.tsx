import React from 'react';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthPlayground } from './AuthPlayground';

function App() {
  return (
    <Provider store={store} >
      <Router>
        <Switch>
        <Route path="/signup">
      <div className="App">
        <AuthPlayground />
      </div>
          </Route>
          <Route path="/signin">
            {/* signin */}
          </Route>
          <Route path="/">
            {/* Home */}
            <div>Landing Page</div>
          </Route>
      </Switch>
      </Router>
    </Provider>
  );
}

export default App;
