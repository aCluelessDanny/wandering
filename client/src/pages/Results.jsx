
import React from 'react'

const Results = ({ setStatus, tracks, results }) => {
  const displaySongs = () => {
    // console.log(tracks);

    return tracks.map(({ metadata, features }, i) => (
      <div key={i}>
        <h3>{metadata.name}</h3>
        <h4>by {metadata.artists.map(a => a.name).join(", ")}</h4>
        <p>Popularity {metadata.popularity}</p>
        <p>Acousticness: {features.acousticness}</p>
        <p>Danceability: {features.danceability}</p>
        <p>Energy: {features.energy}</p>
        <p>Instrumentalness: {features.instrumentalness}</p>
        <p>Liveness: {features.liveness}</p>
        <p>Loudness: {features.loudness}</p>
        <p>Speechiness: {features.speechiness}</p>
        <p>Valence: {features.valence}</p>
      </div>
    ))
  }

  const displayResults = () => (
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
        <p>Valence: {features.valence}</p>
      </div>
    ))
  )

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <h1>Selection</h1>
        <div>
          {displaySongs()}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h1>Results</h1>
        <div>
          {results ? displayResults() : null}
        </div>
      </div>
    </div>
  )
}

export default Results;
