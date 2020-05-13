
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SpotifyWebApi from 'spotify-web-api-js';
const spot = new SpotifyWebApi();

const Home = ({ token }) => {
  const [status, setStatus] = useState(0)

  useEffect(() => {
    spot.setAccessToken(token);
  }, [token]);

  // const test = () => {
  //   console.log(spot.getAccessToken())
  //   spot.getMyTopTracks()
  //     .then((resp) => console.log(resp))
  //     .catch((err) => console.error(err));
  // }

  return (
    <div>
      <h1>Success!</h1>
      <div>
        <button>Get your Top Tracks</button>
      </div>
    </div>
  )
}

Home.propTypes = {
  token: PropTypes.string.isRequired
}

export default Home;
