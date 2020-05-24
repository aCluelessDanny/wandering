
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { CSSTransition } from 'react-transition-group';

import Layout from '../components/Layout';
import Dashboard from './Dashboard';
import Playlists from './Playlists';
import Results from './Results';
import Features from './Features';
import './transitions.css';

import Spotify from '../utils/spotify';
import recommendTracks from '../utils/recommendTracks';
import extractTracks from '../utils/extractTracks';

let spotify = new Spotify();

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

  // const Page = () => {
  //   switch (page) {
  //     case 0:
  //     case 1: return (
  //       <Dashboard
  //         setPage={setPage}
  //         useTopTracks={useTopTracks}
  //         spotify={spotify}
  //         extractAndRecommend={extractAndRecommend}
  //       />
  //     )
  //     case 2: return <Playlists spotify={spotify} extractAndRecommend={extractAndRecommend}/>
  //     case 3: return <Results target={target} results={results}/>
  //     case 4: return <Features id={spotify.getID()}/>
  //     default: return <div>EH?!</div>
  //   }
  // }

  return (
    <Layout features={page === 0} back={page >= 2 && page <= 4} setPage={setPage}>
      <CSSTransition in={page === 0} unmountOnExit timeout={500} classNames="dashboard">
        <Dashboard
          setPage={setPage}
          useTopTracks={useTopTracks}
          spotify={spotify}
          extractAndRecommend={extractAndRecommend}
        />
      </CSSTransition>
      <CSSTransition in={page === 2} unmountOnExit timeout={500} classNames="playlists">
        <Playlists spotify={spotify} extractAndRecommend={extractAndRecommend}/>
      </CSSTransition>
      <CSSTransition in={page === 3} unmountOnExit timeout={500} classNames="results">
        <Results target={target} results={results}/>
      </CSSTransition>
      <CSSTransition in={page === 4} unmountOnExit timeout={500} classNames="features">
        <Features id={spotify.getID()}/>
      </CSSTransition>
    </Layout>
  )
}

export default Home;
