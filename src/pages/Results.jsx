
import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const Half = styled.div`
  flex: 1;
  height: 100%;
  overflow: scroll;
`

const Results = ({ target: { tracks, tastes }, results }) => {
  const [preview, setPreview] = useState(undefined);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef();

  useEffect(() => {
    if (!preview) { return }
    audioRef.current.pause();
    audioRef.current.load();
    setPlaying(true);
  }, [preview]);

  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing])

  const togglePlayback = (url) => {
    if (preview === url) {
      setPlaying(!playing);
    } else {
      setPlaying(false);
      setPreview(url);
    }
  }

  const DisplayTastes = () => (
    <div>
      <p>Popularity: {tastes.popularity}</p>
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
      results.map(({ name, popularity, features, score, preview }, i) => (
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
          <p><b>Score: {score}</b></p>
          <p><span onClick={() => togglePlayback(preview)}>Click to preview!</span></p>
        </div>
      ))
    )
  }

  return (
    <Container>
      <Half>
        <h1>Your Music Tastes!</h1>
        <DisplayTastes/>
        <h1>Selection</h1>
        <DisplaySongs/>
      </Half>
      <Half>
        <h1>Results</h1>
        <DisplayResults/>
      </Half>
      <audio ref={audioRef} src={preview} onEnded={() => setPlaying(false)}/>
    </Container>
  )
}

export default Results;
