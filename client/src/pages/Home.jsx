
import Dashboard from './Dashboard';
import Results from './Results';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cookies from 'js-cookie';
import SpotifyWebApi from 'spotify-web-api-js';
const spot = new SpotifyWebApi();

const round = (val, decimals) => Number(Math.round(`${val}e${decimals}`) + `e-${decimals}`);

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

    for (const prop in tastes) {
      tastes[prop] /= tracks.length;
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
        setPage(1);
        return data;
      })
      .then(data => {
        console.log(data, target);
        predictRecommendations(data);
      })
      .catch(err => console.error(err))
  }

  // Predicts recommendations based on selected tracks
  const predictRecommendations = ({ tastes, tracks }) => {
    console.log(tracks);
    // Exit if there are no selected tracks
    if (!tracks) { return }

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
          const album = { id: t.album.id, name: t.album.name };
          const artists = t.artists.map(artist => ({ id: artist.id, name: artist.name }));

          return {
            count: a.count,
            id: t.id,
            name: t.name,
            album,
            artists,
            popularity: t.popularity
          };
        })
      }).flat();    // Flatten for easier handling

      const ids = tracks.map(t => t.id);

      return spot.getAudioFeaturesForTracks(ids)
        .then(({ audio_features }) => {
          const ret = [];
          for (let i = 0; i < ids.length; i++) {
            const features = {
              acousticness: audio_features[i].acousticness,
              danceability: audio_features[i].danceability,
              energy: audio_features[i].energy,
              instrumentalness: audio_features[i].instrumentalness,
              liveness: audio_features[i].liveness,
              loudness: audio_features[i].loudness,
              speechiness: audio_features[i].speechiness,
              tempo: audio_features[i].tempo,
              valence: audio_features[i].valence
            }
            ret.push({ ...tracks[i], features })
          }
          return ret;
        });
    }

    // Calculate "scores" for songs
    const getScores = (tracks) => {
      // const { tastes } = target;
      tracks = tracks.map(t => {
        const { popularity, features } = t;
        let score = 0;

        // The closer to 0, the more compatible it is to the user's tastes!
        score += .3 * Math.abs(tastes.popularity - popularity);
        score += .5 * Math.abs(tastes.energy - features.energy);
        score += .4 * Math.abs(tastes.valence - features.valence);
        score += .35 * Math.abs(tastes.danceability - features.danceability);
        score += .25 * Math.abs(tastes.tempo - features.tempo);
        score += .2 * Math.abs(tastes.acousticness - features.acousticness);
        score += .2 * Math.abs(tastes.instrumentalness - features.instrumentalness);
        score += .1 * Math.abs(tastes.speechiness - features.speechiness);
        score += .1 * Math.abs(tastes.liveness - features.liveness);
        score *= Math.pow(3/5, t.count - 1);
        score = round(score, 5);

        return { ...t, score };
      });

      // Sort by ascending score order
      return tracks.sort((a, b) => a.score - b.score);
    }

    // Get a flat array of every artists' ID
    const relatedArtistIds = tracks.map(({ metadata: { artists }}) => (
      artists.map(({ id }) => id)
    )).flat();

    // The main attraction
    getRelatedArtists(relatedArtistIds)
      .then(data => data.flat())
      .then(data => removeAndCountDuplicates(data))
      .then(data => getArtistTopTracks(data))
      .then(data => getSampleAudioFeatures(data))
      .then(data => getScores(data))
      .then(data => setResults(data))
      .catch(err => console.error(err))
  }

  // return (target.tracks.length > 0 ? (
  //   <Results target={target} results={results}/>
  // ) : (
  //   <Dashboard test={getTopTrackData}/>
  // ));

  switch (page) {
    case 0: return <Dashboard test={getTopTrackData}/>
    case 1: return <Results target={target} results={results}/>
    default: return <div>EH?!</div>
  }
}

Home.propTypes = {
  token: PropTypes.string.isRequired
}

export default Home;
