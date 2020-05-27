
import { getTrackScore } from './scoring';

// Predicts recommendations based on selected tracks
const recommendTracks = ({ resolve, reject }, spotify, { tastes, tracks }) => {
  // Exit if there are no selected tracks
  if (!tracks) { return }

  // Get related artists from a list of artists
  const getRelatedArtists = (ids) => {
    const promises = ids.map((id) => (
      spotify.getRelatedArtistsOfArtist(id)
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

  // Get top tracks of each "related" artist
  const getArtistTopTracks = (artists) => {
    const promises = artists.map(async ({ name, count, id }) => ({
      name,
      count,
      topTracks: await spotify.getArtistTopTracks(id, 'from_token')
    }))

    // Wait til every ID has been processed
    return Promise.all(promises)
      .then(data => data.map(({ name, count, topTracks }) => ({ name, count, tracks: topTracks.tracks })))
      .then(data => data.slice(0, 10));
  }

  // Get audio features from specified tracks
  // TODO: Allow using more than 100 track IDs
  const getSampleAudioFeatures = (artTracks) => {
    const tracks = artTracks.map(a => (
      a.tracks.map(t => ({ count: a.count, ...t }))
    )).flat();
    const ids = tracks.map(t => t.id);

    return spotify.getAudioFeaturesForTracks(ids)
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
    // Get scores (and breakdowns) and sort them by ascending score order
    tracks = tracks.map(t => ({ ...t, ...getTrackScore(t, tastes) }));
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
    .then(data => resolve(data))
    .catch(err => reject(err))
}

export default recommendTracks;
