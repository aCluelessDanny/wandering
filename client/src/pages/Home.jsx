
import Dashboard from './Dashboard';
import Results from './Results';
import Features from './Features';
import Search from './Search';

import recommendTracks from '../utils/recommendTracks';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cookies from 'js-cookie';
import SpotifyWebApi from 'spotify-web-api-js';
import round from 'lodash/round';

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
  // Extracts data from tracks
  const extractTrackData = (tracks) => {
    const trackData = [];

    for (const t of tracks) {
      let {
        // Track metadata
        id,
        name,
        album,
        artists,
        popularity,
        // Track audio features
        acousticness,
        danceability,
        energy,
        instrumentalness,
        liveness,
        loudness,
        speechiness,
        tempo,
        valence
      } = t;

      album = { id: album.id, name: album.name };
      artists = artists.map(a => ({ id: a.id, name: a.name }));

      trackData.push({
        metadata: { id, name, album, artists, popularity },
        features: { acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, valence }
      });
    }

    return trackData;
  }

  // Calculate the user's music tastes based on tracks
  // TODO: Check if averages will do or not
  const getUserMusicTastes = (tracks) => {
    const defaultValues = {
      popularity: 0,
      acousticness: 0,
      danceability: 0,
      energy: 0,
      instrumentalness: 0,
      liveness: 0,
      loudness: 0,
      speechiness: 0,
      tempo: 0,
      valence: 0
    }

    let tastes = tracks.reduce((accum, { metadata: { popularity }, features }) => {
      accum.popularity += popularity;
      for (const prop in features) {
        accum[prop] += features[prop];
      }
      return accum;
    }, defaultValues);

    for (const feature in tastes) {
      tastes[feature] /= tracks.length;
      tastes[feature] = round(tastes[feature], 5);
    }

    return tastes;
  }

  // Register tracks to db
  const registerTracks = (data) => {
    const { tracks } = data;

    return axios.get('/api/getUser', { params: { id: userID }})
      .then(user => {
        const { data: { _id }} = user;

        const promises = tracks.map(({ metadata, features }) => (
          axios.post('/api/registerTrack', {
            userID: _id,
            trackID: metadata.id,
            name: metadata.name,
            album: metadata.album,
            artists: metadata.artists,
            popularity: metadata.popularity,
            features
          })
        ));

        return Promise.all(promises)
          .then(_ => data);
      })
      .catch(err => console.error(err));
  }

  // Get user's top tracks, according to Spotify
  const getTopTrackData = () => {
    spot.getMyTopTracks({ limit: 10 })
      .then(async ({ items }) => {
        const ids = items.map(i => i.id);
        const { audio_features: features } = await spot.getAudioFeaturesForTracks(ids);
        return { items, features };
      })
      .then(({ items, features }) => {
        let tracks = [];
        for (let i = 0; i < items.length; i++) {
          tracks.push({ ...items[i], ...features[i] });
        }
        tracks = extractTrackData(tracks);

        return {
          tracks,
          tastes: getUserMusicTastes(tracks)
        }
      })
      .then(data => registerTracks(data))
      .then(data => {
        setTarget(data);
        setPage(3);
        return data;
      })
      .then(data => recommendTracks(spot, setResults, data))
      .catch(err => console.error(err))
  }

  const Page = () => {
    switch (page) {
      case 0: return <Dashboard setPage={setPage} test={getTopTrackData}/>
      case 1: return <Search spot={spot}/>
      case 3: return <Results target={target} results={results}/>
      case 4: return <Features userID={userID}/>
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
