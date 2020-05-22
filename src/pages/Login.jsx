
import React from 'react';
import styled from '@emotion/styled';

import Layout from '../components/Layout';

const CLIENT_ID = '8cb53daed4514ef4bbc92359e25ae5d2';
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const SCOPES = ['user-top-read', 'playlist-read-private', 'user-read-recently-played', 'playlist-modify-private', 'user-library-read'];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  text-align: center;
`

const Title = styled.h1`
  font-size: 2.5em;
`

const Description = styled.p``

const LoginButton = styled.button``

const Login = () => {
  const url = encodeURI(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(" ")}`);

  return (
    <Layout>
      <Container>
        <Title>Wandering</Title>
        <Description>Find new music with some help from your musical tastes...</Description>
        <LoginButton onClick={() => window.location.href = url}>Login with Spotify</LoginButton>
      </Container>
    </Layout>
  );
}

export default Login;
