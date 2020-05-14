
import React from 'react'

const Results = ({ setStatus, target: { tracks, tastes }, results }) => {
  const DisplayTastes = () => (
    <div>
      <p>Acousticness: {tastes.acousticness}</p>
      <p>Danceability: {tastes.danceability}</p>
      <p>Energy: {tastes.energy}</p>
      <p>Instrumentalness: {tastes.instrumentalness}</p>
      <p>Liveness: {tastes.liveness}</p>
      <p>Loudness: {tastes.loudness}</p>
      <p>Speechiness: {tastes.speechiness}</p>
      <p>Tempo: {tastes.tempo}</p>
      <p>Valence: {tastes.valence}</p>
    </div>
  )


  const DisplaySongs = () => (
    tracks.map(({ metadata, features }, i) => (
      <div key={i}>
        <h3>{metadata.name}</h3>
        <h4>by {metadata.artists.map(a => a.name).join(", ")}</h4>
        <p>Popularity: {metadata.popularity}</p>
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
    ))
  );

  const DisplayResults = () => {
    if (!results) { return null }
    return (
      results.map(({ name, popularity, features }, i) => (
        <div key={i}>
          <h3>{name}</h3>
          <p>Popularity: {popularity}</p>
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
      ))
    )
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <h1>Your Music Tastes!</h1>
        <DisplayTastes/>
        <h1>Selection</h1>
        <DisplaySongs/>
      </div>
      <div style={{ flex: 1 }}>
        <h1>Results</h1>
        <DisplayResults/>
      </div>
    </div>
  )
}

export default Results;
