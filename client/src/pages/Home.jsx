
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SpotifyWebApi from 'spotify-web-api-js';
const spot = new SpotifyWebApi();

const Home = ({ token }) => {
  useEffect(() => {
    spot.setAccessToken(token);
  }, [token]);

  const test = () => {
    console.log(spot.getAccessToken())
    spot.getMyTopTracks()
      .then((resp) => console.log(resp))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <h1 onClick={test}>Success!</h1>
      <p>{token}</p>
    </div>
  )
}

Home.propTypes = {
  token: PropTypes.string.isRequired
}

export default Home;
