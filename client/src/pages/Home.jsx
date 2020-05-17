
import Dashboard from './Dashboard';
import Results from './Results';
import Features from './Features';
import Search from './Search';

import recommendTracks from '../utils/recommendTracks';
import extractTracks from '../utils/extractTracks';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cookies from 'js-cookie';
import SpotifyWebApi from 'spotify-web-api-js';

const spot = new SpotifyWebApi();

const Home = ({ token }) => {
  // STATE //
  const [page, setPage] = useState(0);
  const [userID, setUserID] = useState("");
  const [target, setTarget] = useState({ tastes: {}, tracks: [] });
  const [results, setResults] = useState([]);

  // EFFECTS //
  // Set access token on load
  useEffect(() => {
    // Set a cookie to store session if not already
    if (!Cookies.get('wandering')) {
      Cookies.set('wandering', token, { expires: new Date(new Date().getTime() + 50 * 60 * 1000), path: '' });
    }
    // Set access token for later requests
    spot.setAccessToken(token);
    // Save user information for session and database
    spot.getMe()
      .then(({ id, display_name }) => {
        setUserID(id);
        return axios.post('/api/createUser', { id, display_name })
      })
      .catch(err => console.error(err));
  }, [token]);

  // FUNCTIONS //
  // General function for extracting track data and calculating recommendations
  const extractAndRecommend = (items) => (
    new Promise((resolve, reject) => extractTracks({ resolve, reject }, spot, userID, items))
      .then(data => {
        setTarget(data);
        setPage(3);
        return data;
      })
      .then(data => new Promise((resolve, reject) => recommendTracks({ resolve, reject }, spot, data)))
      .then(data => setResults(data))
      .catch(err => console.error(err))
  )

  // Use the user's top tracks, according to Spotify
  const useTopTracks = () => {
    spot.getMyTopTracks({ limit: 10 })
      .then(({ items }) => extractAndRecommend(items))
      .catch(err => console.error(err));
  }

  const Page = () => {
    switch (page) {
      case 0: return (
        <Dashboard setPage={setPage} useTopTracks={useTopTracks}/>
      )
      case 1: return (
        <Search spot={spot} extractAndRecommend={extractAndRecommend}/>
      )
      case 3: return (
        <Results target={target} results={results}/>
      )
      case 4: return (
        <Features userID={userID}/>
      )
      default: return <div>EH?!</div>
    }
  }

  return (
    <div>
      <Page/>
      <button onClick={() => setPage(0)}>Go to Home</button>
    </div>
  )
}

Home.propTypes = {
  token: PropTypes.string.isRequired
}

export default Home;
