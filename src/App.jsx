
import React from 'react';
import { Router, Redirect, useLocation } from '@reach/router';
import Cookies from 'js-cookie';
import querystring from 'querystring';

import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';

const App = () => {
  let token = Cookies.get('wandering') || "";

  const Authenticate = () => (
    token ? <Home token={token}/> : <Redirect from="" to="/login" noThrow/>
  )

  const AuthSuccess = () => {
    const { hash } = useLocation();
    const { "#access_token": access_token } = querystring.parse(hash);
    token = access_token;
    return <Redirect from="" to="/" noThrow/>
  }

  return (
    <Layout>
      <Router>
        <Authenticate path="/"/>
        <Login path="/login"/>
        <AuthSuccess path="/success"/>
      </Router>
    </Layout>
  )
}

export default App;
