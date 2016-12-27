import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import initializeStore from './store/initializeStore';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/toastr/build/toastr.min.css';
import {sayHello} from './actions/helloActions';

const store = initializeStore();
store.dispatch(sayHello());

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
