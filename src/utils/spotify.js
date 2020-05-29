
import axios from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';

// Spotify-Axios instance
const spotios = axios.create();
spotios.defaults.baseURL = "https://api.spotify.com";

// Redirect user to login page when session expires
spotios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 400 || err.response.status === 401) {
      alert("Your session has expired! Please log in again to continue using Wandering.");
      window.location.replace("/login");
    }
    return Promise.reject(err);
  });

// Axios interceptor for retrying requests when rate limited
axiosRetry(spotios, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err) => isNetworkOrIdempotentRequestError(err) || err.code(429)
});

const generalGet = (resolve, reject, url, params = {}) => (
  spotios.get(url, { params })
    .then(({ data }) => resolve(data))
    .catch(err => reject(err))
)

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
    spotios.defaults.headers.common['Authorization'] = this.auth;
  }

  // Get user data and store it for later requests
  getMe() {
    const url = '/v1/me';
    return new Promise((resolve, reject) => {
    spotios.get(url)
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
    const url = '/v1/me/top/tracks';
    const params = { limit: 10, time_range: "short_term" };
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Get the user's playlists
  // NOTE: Hardcoded to 50 playlists
  getUserPlaylists(offset, limit) {
    const url = '/v1/me/playlists';
    const params = { offset, limit };
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Get tracks from a playlist
  getPlaylistTracks(id, offset) {
    const url = `/v1/playlists/${id}/tracks`;
    const params = { offset };
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Get tracks from user's library
  getTracksFromLibrary(offset = 0, ret = []) {
    const url = '/v1/me/tracks';
    const params = { offset, limit: 50, country: 'from_token' };
    return spotios.get(url, { params })
      .then(({ data }) => {
        ret.push(...data.items);
        if (data.next === null) { return ret }
        return this.getTracksFromLibrary(offset + 50, ret);
      })
      .catch(err => Promise.reject(err))
    // return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Search for tracks
  // NOTE: Hardcoded to 6 searched tracks
  search(q) {
    const url = '/v1/search';
    const params = { q, type: 'track', limit: 6 };
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Get audio features of several tracks
  getAudioFeaturesForTracks(ids) {
    const url = '/v1/audio-features';
    const params = { ids: encodeURI(ids.join(',')) }
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Get an artist's related artists
  getRelatedArtistsOfArtist(id) {
    const url = `/v1/artists/${id}/related-artists`;
    return new Promise((resolve, reject) => generalGet(resolve, reject, url));
  }

  // Get an artist's top tracks
  getArtistTopTracks(id) {
    const url = `/v1/artists/${id}/top-tracks`;
    const params = { country: 'from_token' };
    return new Promise((resolve, reject) => generalGet(resolve, reject, url, params));
  }

  // Add track to user's library
  putTrackInLibrary(id) {
    const url = '/v1/me/tracks';
    const data = { ids: [id] };
    return new Promise((resolve, reject) => (
      spotios.put(url, data)
        .then(({ data }) => resolve(data))
        .catch(err => reject(err))
    ))
  }

  // Add track to a user's playlist
  postTrackInPlaylist(pID, tID) {
    const url = `/v1/playlists/${pID}/tracks`;
    const data = { uris: [`spotify:track:${tID}`] };
    return new Promise((resolve, reject) => (
      spotios.post(url, data)
        .then(({ data }) => resolve(data))
        .catch(err => reject(err))
    ))
  }

  // Create a playlist for the user
  postPlaylist(name) {
    const url = `/v1/users/${this.id}/playlists`;
    const data = { name };
    return new Promise((resolve, reject) => (
      spotios.post(url, data)
        .then(({ data }) => resolve(data))
        .catch(err => reject(err))
    ))
  }
}

export default Spotify;
