
import kmeans from 'clusters';
import clamp from 'lodash/clamp';
import round from 'lodash/round';

/* Normalize data into a common format for calculation. The following is the format:
[
  popularity -> /100
  energy
  tempo -> clamp to 50-200 range -> -50 -> /150
  valence
  danceability
  instrumentalness
  acousticness
]
*/
const normalizeData = (popularity, features) => (
  [
    popularity / 100,
    features.energy,
    (clamp(features.tempo, 50, 200) - 50) / 150,
    features.valence,
    features.danceability,
    features.acousticness,
    features.instrumentalness
  ]
)

// Use k-means clustering to find the "centroids" of a user's music tastes
const getUserTastes = (tracks) => {
  let data = [];
  for (const { features, metadata } of tracks) {
    data.push(normalizeData(metadata.popularity, features));
  }

  kmeans.k(3);
  kmeans.data(data);
  const ret = kmeans.clusters();
  return ret.map(r => r.centroid);
}

/* Get a weighted score of a track against one of the user taste "centroid"
The following is how the score is calculated:
- popularity => x0.25 if track popularity is lower than user's tastes, x0.15 otherwise
- energy => x0.5
- tempo => x0.5
- valence => x0.4
- danceability => x0.35
- instrumentalness => x0.2
- acousticness => x0.15
- count (artist repetition count) => Multiply score by 0.6^(count - 1)
*/
const getWeightedScore = ({ popularity, features, count }, c) => {
  const data = normalizeData(popularity, features);
  let score = 0;

  score += (data[0] > c[0] ? 0.15 : 0.25) * Math.abs(data[0] - c[0]);
  score += 0.50 * Math.abs(data[1] - c[1]);
  score += 0.50 * Math.abs(data[2] - c[2]);
  score += 0.40 * Math.abs(data[3] - c[3]);
  score += 0.35 * Math.abs(data[4] - c[4]);
  score += 0.20 * Math.abs(data[5] - c[5]);
  score += 0.15 * Math.abs(data[6] - c[6]);
  score *= Math.pow(3/5, count - 1);
  score = round(score, 5);

  return { score, scoreBreakdown: data };
}

// Get minimum score of track out of all centroids
const getTrackScore = (track, centroids) => {
  let minScore = -1;
  let minIndex = -1;
  let breakdown = [];

  for (let i = 0; i < centroids.length; i++) {
    const { score, scoreBreakdown } = getWeightedScore(track, centroids[i]);
    if (minScore === -1 || score < minScore) {
      minScore = score;
      minIndex = i;
      breakdown = scoreBreakdown;
    }
  }

  return { score: minScore, breakdown, centroid: minIndex };
}

export { getUserTastes, getTrackScore };
