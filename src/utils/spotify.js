
import axios from 'axios';

const generalGet = (resolve, reject, url, params={}) => (
  axios.get(url, { params })
    .then(({ data }) => resolve(data))
    .catch(err => reject(err))
)

// TODO: Handle errors and retries
class Spotify {
  // CONSTRUCTOR
  constructor() {
    this.auth = undefined;
    this.id = undefined;
    this.name = undefined;
  }

  // GETTERS
  getID() { return this.id }

  // FUNCTIONS
  // Set access token for later requests
  setAuth(token) {
    this.auth = `Bearer ${token}`;
    axios.defaults.headers.common['Authorization'] = this.auth;
  }

  // Get user data and store it for later requests
  getMe() {
    const url = 'https://api.spotify.com/v1/me';
    return new Promise((resolve, reject) => {
    axios.get(url)
        .then(({ data }) => {
          const { id, display_name } = data;
          this.id = id;
          this.name = display_name;

          return axios.post('/api/createUser', { id, display_name })
        })
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  }

  // Get the user's top tracks, according to Spotify
  // NOTE: Hardcoded to 10 top tracks
  getMyTopTracks() {
    const url = 'https://api.spotify.com/v1/me/top/tracks';
    const params = { limit: 10 };
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
    // return new Promise((resolve, reject) => {
    //   axios.get(url, { params })
    //     .then(({ data }) => resolve(data))
    //     .catch(err => reject(err))
    // })
  }

  // Get the user's playlists
  // NOTE: Hardcoded to 50 playlists
  getUserPlaylists() {
    const url = 'https://api.spotify.com/v1/me/playlists';
    const params = { limit: 50 };
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Get tracks from a playlist
  // TODO: Handle pagination
  getPlaylistTracks(id) {
    const url = `https://api.spotify.com/v1/playlists/${id}/tracks`;
    return new Promise((resolve, reject) => generalGet(resolve, reject, url));
  }

  // Search for tracks
  // NOTE: Hardcoded to 6 searched tracks
  search(q) {
    const url = 'https://api.spotify.com/v1/search';
    const params = { q, type: 'track', limit: 6 };
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Get audio features of several tracks
  // FIXME: Very prone to be rate limited in its current state. Only allows up to 100 ids
  getAudioFeaturesForTracks(ids) {
    const url = 'https://api.spotify.com/v1/audio-features';
    const params = { ids: encodeURI(ids.join(',')) }
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Get an artist's related artists
  getRelatedArtistsOfArtist(id) {
    const url = `https://api.spotify.com/v1/artists/${id}/related-artists`;
    return new Promise((resolve, reject) => generalGet(resolve, reject, url));
  }

  // Get an artist's top tracks
  getArtistTopTracks(id) {
    const url = `https://api.spotify.com/v1/artists/${id}/top-tracks`;
    const params = { country: 'from_token' };
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }
}

export default Spotify;
