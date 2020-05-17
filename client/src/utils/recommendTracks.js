
import round from 'lodash/round';

// Predicts recommendations based on selected tracks
const recommendTracks = ({ resolve, reject }, spot, { tastes, tracks }) => {
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

  // Get top tracks of each "related" artist
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
    tracks = tracks.map(t => {
      const { popularity, features } = t;
      let score = 0;

      // The closer to 0, the more compatible it is to the user's tastes!
      score += (popularity > tastes.popularity ? .15 : .3) * Math.abs(tastes.popularity - popularity);
      score += .5 * Math.abs(tastes.energy - features.energy);
      score += .45 * Math.abs(tastes.tempo / 100 - features.tempo / 100);
      score += .4 * Math.abs(tastes.valence - features.valence);
      score += .35 * Math.abs(tastes.danceability - features.danceability);
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
    .then(data => resolve(data))
    // .then(data => set(data))
    .catch(err => reject(err))
}

export default recommendTracks;
