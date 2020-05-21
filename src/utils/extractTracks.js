
import axios from 'axios';
import round from 'lodash/round';

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

  spotify.getAudioFeaturesForTracks(ids)
    .then(({ audio_features }) => {
      let tracks = [];
      for (let i = 0; i < items.length; i++) {
        tracks.push({ ...items[i], ...audio_features[i] });
      }
      tracks = grabTrackData(tracks);
      const tastes = getUserMusicTastes(tracks);

      return { tracks, tastes };
    })
    .then(data => registerTracks(data, spotify.getID()))
    .then(data => resolve(data))
    .catch(err => reject(err));
}

export default extractTracks;
