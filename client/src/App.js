
import React from 'react';
import { Router, Redirect, useLocation } from '@reach/router';
import querystring from 'querystring';

import Login from './pages/Login';
import Home from './pages/Home';

const App = () => {
  let token = "";

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
    <Router>
      <Authenticate path="/"/>
      <Login path="/login"/>
      <AuthSuccess path="/success"/>
    </Router>
  )
}

export default App;
