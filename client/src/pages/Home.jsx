
import Dashboard from './Dashboard';
import Results from './Results';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import SpotifyWebApi from 'spotify-web-api-js';
const spot = new SpotifyWebApi();

const Home = ({ token }) => {
  // STATE //
  const [status, setStatus] = useState(false);
  const [target, setTarget] = useState({ tastes: {}, tracks: [] });
  const [results, setResults] = useState([]);

  // EFFECTS //
  // Set access token on load
  useEffect(() => {
    if (!Cookies.get('wandering')) {
      Cookies.set('wandering', token, { expires: new Date(new Date().getTime() + 50 * 60 * 1000), path: '' });
    }
    spot.setAccessToken(token);
  }, []);

  // Get user track data when prompted
  useEffect(() => {
    if (status) {
      getTopTrackData();
    }
  }, [status]);

  // Predict recommendations after getting track data
  useEffect(() => {
    if (target.tracks) {
      predictRecommendations();
      setStatus(false);
    }
  }, [target]);

  // FUNCTIONS //
  // Extracts data from tracks
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
        tempo,
        valence
      } = t;
      artists = artists.map(a => ({ name: a.name, id: a.id }));

      trackData.push({
        metadata: { id, name, albumName, artists, popularity },
        features: { acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, valence }
      });
    }

    return trackData;
  }

  // Calculate the user's music tastes based on tracks
  // TODO: Check if averages will do or not
  const getUserMusicTastes = (tracks) => {
    const defaultValues = {
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

    let tastes = tracks.reduce((accum, { features }) => {
      for (const prop in accum) {
        accum[prop] += features[prop];
      }
      return accum;
    }, defaultValues);

    for (const prop in tastes) {
      tastes[prop] /= tracks.length;
    }

    return tastes;
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
      .then(data => setTarget(data))
      .catch(err => console.error(err))
  }

  // Predicts recommendations based on selected tracks
  const predictRecommendations = () => {
    // Exit if there are no selected tracks
    if (!target.tracks) { return }

    // Get related artists from a list of artists
    const getRelatedArtists = (ids) => {
      const promises = ids.map((id) => (
        spot.getArtistRelatedArtists(id)
          .then(({ artists }) => {
            return artists.map(({ id, name }) => ({ id, name }));
          })
      ))

      // Wait til every ID has been processed
      return Promise.all(promises)
    }

    // Remove and count duplicates in artist list
    const removeAndCountDuplicates = (arr) => {
      return arr.reduce((unique, current) => {
        if (!unique.some(o => current.id === o.id)) {
          unique.push({ ...current, count: 1 });
        } else {
          const pos = unique.map(x => x.id).indexOf(current.id);
          unique[pos].count++;
        }
        return unique;
      }, [])
    }

    // Get top tracks of each artist
    const getArtistTopTracks = (artists) => {
      const promises = artists.map(async ({ name, count, id }) => ({
        name,
        count,
        topTracks: await spot.getArtistTopTracks(id, 'from_token')
      }))

      // Wait til every ID has been processed
      return Promise.all(promises)
        .then(data => data.map(({ name, count, topTracks }) => ({ name, count, tracks: topTracks.tracks })))
        .then(data => data.slice(0, 10));
    }

    // Get audio features from specified tracks
    // TODO: Allow using more than 100 track IDs
    const getSampleAudioFeatures = (artTracks) => {
      const tracks = artTracks.map(a => {
        return a.tracks.map(t => {
          return {
            count: a.count,
            id: t.id,
            name: t.name,
            popularity: t.popularity
          };
        })
      }).flat();    // Flatten for easier handling

      const ids = tracks.map(t => t.id);

      return spot.getAudioFeaturesForTracks(ids)
        .then(({ audio_features }) => {
          const ret = [];
          for (let i = 0; i < ids.length; i++) {
            ret.push({ ...tracks[i], features: { ...audio_features[i] } })
          }
          return ret;
        });
    }

    // Get a flat array of every artists' ID
    const relatedArtistIds = target.tracks.map(({ metadata: { artists }}) => (
      artists.map(({ id }) => id)
    )).flat();

    // The main attraction
    getRelatedArtists(relatedArtistIds)
      .then(data => data.flat())
      .then(data => removeAndCountDuplicates(data))
      .then(data => getArtistTopTracks(data))
      .then(data => getSampleAudioFeatures(data))
      .then(data => setResults(data))
      .catch(err => console.error(err))
  }

  return (target.tracks.length > 0 ? (
    <Results target={target} results={results}/>
  ) : (
    <Dashboard setStatus={setStatus}/>
  ));
}

Home.propTypes = {
  token: PropTypes.string.isRequired
}

export default Home;
