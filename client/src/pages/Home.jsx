
import Dashboard from './Dashboard';
import Results from './Results';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SpotifyWebApi from 'spotify-web-api-js';
const spot = new SpotifyWebApi();

const Home = ({ token }) => {
  const [status, setStatus] = useState(0);
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    spot.setAccessToken(token);
  }, []);

  useEffect(() => {
    switch (status) {
      case 3: getTopTracks(); break;
      default: break;
    }
  }, [status]);

  useEffect(() => {
    console.log("Data:", data);
  }, [data]);

  const extractTrackData = (tracks) => {
    const trackData = [];

    for (const t of tracks) {
      let {
        // Track metadata
        album: { name: albumName },
        artists,
        id,
        name,
        popularity,
        // Track audio features
        acousticness,
        danceability,
        energy,
        instrumentalness,
        liveness,
        loudness,
        speechiness,
        valence
      } = t;
      artists = artists.map(a => a.name);

      trackData.push({
        metadata: { id, name, albumName, artists, popularity },
        features: { acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, valence }
      });
    }

    return trackData;
  }

  const getTopTracks = () => {
    spot.getMyTopTracks()
      .then(({ items }) => {
        const ids = items.map(i => i.id);
        spot.getAudioFeaturesForTracks(ids)
          .then(({ audio_features }) => {
            const tracks = [];
            for (let i = 0; i < items.length; i++) {
              tracks.push({ ...items[i], ...audio_features[i]})
            }
            setData(extractTrackData(tracks));
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  switch (status) {
    case 0: return <Dashboard setStatus={setStatus}/>
    case 3: return <Results results={data}/>
    default: return <h2>Error?!</h2>
  }
}

Home.propTypes = {
  token: PropTypes.string.isRequired
}

export default Home;
