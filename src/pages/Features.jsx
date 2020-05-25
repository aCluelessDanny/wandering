
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import round from 'lodash/round';

// TODO: Actually finish this
const Features = ({ id }) => {
  const [count, setCount] = useState(0);
  const [features, setFeatures] = useState({
    acousticness: 0,
    danceability: 0,
    energy: 0,
    instrumentalness: 0,
    liveness: 0,
    loudness: 0,
    speechiness: 0,
    tempo: 0,
    valence: 0,
  });

  useEffect(() => {
    getMusicTastes();
  }, []);

  const getMusicTastes = () => {
    axios.get('/api/getUser', { params: { id }})
      .then(user => {
        const { data: { _id }} = user;
        return axios.get('/api/getTastes', { params: { id: _id }});
      })
      .then(tracks => {
        const { data } = tracks;

        if (data.length === 0) {
          console.log("No data!");
          return;
        }

        const tastes = { ...features };
        data.forEach(d => {
          for (const feature in d) {
            tastes[feature] += d[feature];
          }
        });

        for (const feature in tastes) {
          tastes[feature] /= data.length;
          tastes[feature] = round(tastes[feature], 5);
        }

        setFeatures(tastes);
        setCount(data.length);
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h1>Your Music Tastes!</h1>
      <div>
        <p><b>Song count: {count}</b></p>
        <p>Acousticness: {features.acousticness}</p>
        <p>Danceability: {features.danceability}</p>
        <p>Energy: {features.energy}</p>
        <p>Instrumentalness: {features.instrumentalness}</p>
        <p>Liveness: {features.liveness}</p>
        <p>Loudness: {features.loudness}</p>
        <p>Speechiness: {features.speechiness}</p>
        <p>Tempo: {features.tempo}</p>
        <p>Valence: {features.valence}</p>
      </div>
    </div>
  )
}

export default Features;
