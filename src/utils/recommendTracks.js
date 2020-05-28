
import sequential from 'promise-sequential';
import _concat from 'lodash/concat';

import { getTrackScore } from './scoring';

// Predicts recommendations based on selected tracks
const recommendTracks = ({ resolve, reject }, spotify, { tastes, tracks }) => {
  // Exit if there are no selected tracks
  if (!tracks) { return }

  // Get related artists from a list of artists
  const getRelatedArtists = async (ids) => {
    const ret = [];
    for (const id of ids) {
      await spotify.getRelatedArtistsOfArtist(id)
        .then(({ artists }) => ret.push(artists.map(({ id, name }) => ({ id, name }))))
    }
    return ret;
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

  // Get top tracks of each "related" artist
  const getArtistTopTracks = async (artists) => {
    // NOTE: Grabs the top 40 artists based on the number of times the artist has been found in the previous step
    artists.sort((a, b) => b.count - a.count);
    artists = artists.slice(0, 40);

    const ret = [];
    for (const { name, count, id } of artists) {
      await spotify.getArtistTopTracks(id)
        .then(({ tracks }) => ret.push({ name, count, tracks }));
    }

    return ret;
  }

  // Get audio features from specified tracks
  const getSampleAudioFeatures = (artTracks) => {
    const tracks = artTracks.map(a => (
      a.tracks.map(t => ({ count: a.count, ...t }))
    )).flat();
    const ids = tracks.map(t => t.id);

    // Make sequential promises of 100 IDs each
    const promises = [];
    const chunkSize = 100;
    for (let i = 0; i < ids.length; i += chunkSize) {
      const p = ids.slice(i, i + chunkSize)
      promises.push(() => spotify.getAudioFeaturesForTracks(p));
    }

    return sequential(promises)
      .then(data => {
        const [accum, ...rest] = data;
        for (const r of rest) {
          accum.audio_features = _concat(accum.audio_features, r.audio_features);
        }
        return accum;
      })
      .then(({ audio_features }) => {
        const ret = [];
        for (let i = 0; i < ids.length; i++) {
          if (audio_features[i] === null) { continue }
          ret.push({ ...tracks[i], features: { ...audio_features[i] } })
        }
        return ret;
      });
  }

  // Calculate "scores" for songs
  const getScores = (tracks) => {
    // Get scores (and breakdowns) and sort them by ascending score order
    tracks = tracks.map(t => ({ ...t, ...getTrackScore(t, tastes) }));
    // NOTE: Returns the top 100 songs
    return tracks.sort((a, b) => a.score - b.score).slice(0, 100);
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
    .then(data => resolve(data))
    .catch(err => reject(err))
}

export default recommendTracks;
