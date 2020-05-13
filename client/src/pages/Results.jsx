
import React from 'react'

const Results = ({ setStatus, results }) => {
  const displayResults = () => (
    results.map(({ metadata, features }, i) => (
      <div key={i}>
        <h2>{metadata.name}</h2>
        <h3>by {metadata.artists.join(', ')}</h3>
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
    <div>
      <h1>Results</h1>
      <div>
        {displayResults()}
      </div>
    </div>
  )
}

export default Results;
