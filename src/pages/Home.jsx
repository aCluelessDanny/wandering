
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Cookies from 'js-cookie';

import Layout from '../components/Layout';
import Dashboard from './Dashboard';
import Search from './Search';
import Playlists from './Playlists';
import Results from './Results';
import Features from './Features';

import Spotify from '../utils/spotify';
import recommendTracks from '../utils/recommendTracks';
import extractTracks from '../utils/extractTracks';

let spotify = new Spotify();

const GoHome = styled.button`
  position: absolute;
  bottom: 2em;
  right: 2em;
`

const Home = ({ token }) => {
  // STATE //
  const [page, setPage] = useState(0);
  const [target, setTarget] = useState({ tastes: {}, tracks: [] });
  const [results, setResults] = useState([]);

  // EFFECTS //
  // Set access token on load
  useEffect(() => {
    // Set a cookie to store session if not already
    if (!Cookies.get('wandering')) {
      Cookies.set('wandering', token, { expires: new Date(new Date().getTime() + 50 * 60 * 1000), path: '' });
    }

    // Set up authentication and user data
    spotify.setAuth(token)
    spotify.getMe()
      .catch(err => console.error(err));
  }, [token]);

  // FUNCTIONS //
  // General function for extracting track data and calculating recommendations
  const extractAndRecommend = (items) => (
    new Promise((resolve, reject) => extractTracks({ resolve, reject }, spotify, items))
      .then(data => {
        setPage(3);
        setTarget(data);
        return data;
      })
      .then(data => new Promise((resolve, reject) => recommendTracks({ resolve, reject }, spotify, data)))
      .then(data => setResults(data))
      .catch(err => console.error(err))
  )

  // Use the user's top tracks, according to Spotify
  const useTopTracks = () => {
    spotify.getMyTopTracks()
      .then(({ items }) => extractAndRecommend(items))
      .catch(err => console.error(err));
  }

  const Page = () => {
    switch (page) {
      case 0:
      case 1: return (
        <Dashboard
          setPage={setPage}
          useTopTracks={useTopTracks}
          spotify={spotify}
          extractAndRecommend={extractAndRecommend}
        />
      )
      // case 1: return <Search spotify={spotify} extractAndRecommend={extractAndRecommend}/>
      case 2: return <Playlists spotify={spotify} extractAndRecommend={extractAndRecommend}/>
      case 3: return <Results target={target} results={results}/>
      case 4: return <Features id={spotify.getID()}/>
      default: return <div>EH?!</div>
    }
  }

  return (
    <Layout>
      <Page/>
      <GoHome onClick={() => setPage(0)}>Go to Home</GoHome>
    </Layout>
  )
}

export default Home;
