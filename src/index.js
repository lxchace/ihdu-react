import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router, Route } from "react-router-dom";
import { Provider } from 'react-redux';

import CoursePage from "./Component/allCourse";
import Login from "./Component/login";
import GradesPage from "./Component/grades";
import browserHistory from './Component/history';
import store from "./Store";
import Register from './Component/register';
import Information from './Component/information';
import AccountPage from './Component/account';


const Root = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <App />
            <Route exact path="/" component={CoursePage} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/information" component={Information} />
            <Route path="/grade" component={GradesPage} />
            <Route path="/account" component={AccountPage} />
        </Router>
    </Provider>
)

ReactDOM.render(
    Root
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
