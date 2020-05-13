
import React from 'react'

const CLIENT_ID = '8cb53daed4514ef4bbc92359e25ae5d2';
const REDIRECT_URI = 'http://localhost:3000/success';
const SCOPES = ['user-top-read', 'playlist-read-private', 'user-read-recently-played', 'playlist-modify-private', 'user-library-read']

const Login = () => {
  const url = encodeURI(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(" ")}`);

  return (
    <div>
      <h1>Hello Spotify</h1>
      <a href={url}>Login</a>
    </div>
  );
}

export default Login;
