import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthPlayground } from './AuthPlayground';

function App() {
  return (
    <Provider store={store} >
      <div className="App">
        Hello world
        <AuthPlayground />
      </div>
    </Provider>
  );
}

export default App;
