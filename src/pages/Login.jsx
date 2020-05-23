
import React from 'react';
import styled from '@emotion/styled';

import Layout from '../components/Layout';
import { colors } from '../components/theme';
import logo from '../images/Spotify_Icon_RGB_Black.png';

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

const LoginButton = styled.a`
  display: flex;
  align-items: center;
  height: 50px;
  padding: .4em 1em;
  border-radius: 2em;
  margin: 2em 0;
  background: ${colors.white};
  color: ${colors.dark};
  cursor: pointer;
  text-decoration: none;
`

const Logo = styled.img`
  height: 100%;
  margin-right: .5em;
`

const Login = () => {
  const url = encodeURI(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(" ")}`);

  return (
    <Layout>
      <Container>
        <Title>Wandering</Title>
        <Description>Stumble upon new music with some help from your musical tastes...</Description>
        <LoginButton onClick={() => window.location.href = url}>
          <Logo alt="Spotify logo" src={logo}/>
          <span>Connect with Spotify</span>
        </LoginButton>
      </Container>
    </Layout>
  );
}

export default Login;
