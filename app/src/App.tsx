import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { Loading } from "./Loading";
import { Login } from "./Login";
import { Private } from "./Private";
import { ProtectedRoute } from "./protected-route";
import { Signup } from "./Signup";
import { store } from "./store";

export function App() {
  return (
    <Provider store={store}>
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
          <ProtectedRoute path="/private">
            <Private />
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
