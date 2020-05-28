
import axios from 'axios';
import sequential from 'promise-sequential';
import _concat from 'lodash/concat';

import { getUserTastes } from './scoring';

// Grabs data from tracks
const grabTrackData = (tracks) => {
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

// Register tracks to db
const registerTracks = (data, id) => {
  const { tracks } = data;

  return axios.get('/api/getUser', { params: { id }})
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

// Extracts and registers the relevant track data
const extractTracks = ({ resolve, reject }, spotify, items) => {
  const ids = items.map(t => t.id);

  // Make sequential promises of 100 IDs each
  const promises = [];
  const chunkSize = 100;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const p = ids.slice(i, i + chunkSize)
    promises.push(() => spotify.getAudioFeaturesForTracks(p));
  }

  sequential(promises)
    .then(data => {
      const [accum, ...rest] = data;
      for (const r of rest) {
        accum.audio_features = _concat(accum.audio_features, r.audio_features);
      }
      return accum;
    })
    .then(({ audio_features }) => {
      let tracks = [];
      for (let i = 0; i < items.length; i++) {
        tracks.push({ ...items[i], ...audio_features[i] });
      }
      tracks = grabTrackData(tracks);
      const tastes = getUserTastes(tracks);

      return { tracks, tastes };
    })
    .then(data => registerTracks(data, spotify.getID()))
    .then(data => resolve(data))
    .catch(err => reject(err));
}

export default extractTracks;
