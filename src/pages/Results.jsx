
import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

import Button from '../components/Button';
import { colors } from '../theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 840px;
`

const Duo = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  margin: 1.5em 0;
  overflow: hidden;
`

const Half = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 0 1em;
`

const Header = styled.h2`
  margin-bottom: 1rem;
`

const ResultList = styled.div`
  flex: 1;
  width: 100%;
  overflow: scroll;
`

const Track = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px .5em;
  border-radius: 4px;
  cursor: pointer;
  background: ${colors.white};
  color: ${colors.dark};

  &.selected {
    background: ${colors.light};
  }

  & + & {
    margin-top: 4px;
  }
`

const Artwork = styled.img`
  height: 50px;
  width: 50px;
  margin: 0 8px 0 0;
`

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Artist = styled.p`
  font-size: .7em;
  color: ${colors.dark2};
`

const TrackData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    text-align: center;
  }
`

const BigArtwork = styled.div`
  width: 100%;
  max-width: 300px;
  margin: .5em;
  background: rgba(0,0,0,0.1);
  background: ${props => props.image ? `url(${props.image}) no-repeat center center` : ""};
  background-size: cover;

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`

const Prompt = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Results = ({ spotify, target: { tracks, tastes }, results }) => {
  // STATE AND REFS
  const [selected, setSelected] = useState('');
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef();

  // EFFECTS
  // Stop and load new audio when clicking on a preview
  useEffect(() => {
    if (!selected) { return }
    audioRef.current.pause();
    audioRef.current.load();
    setPlaying(true);

  }, [selected]);

  // Play or pause audio accordingly
  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing])

  // FUNCTIONS
  // Toggle preview playback
  const togglePlayback = (r, i) => {
    if (selected && selected.preview_url === r.preview_url) {
      setPlaying(!playing);
    } else {
      setPlaying(false);
      setSelected({ index: i, ...r });
    }
  }

  // COMPONENTS
  // TODO: Handle null preview links
  const DisplayResults = () => {
    if (!results) { return null }

    return (
      results.map((r, i) => {
        const { name, artists, album: { images } } = r;
        const artistStr = artists.map(a => a.name).join(", ");
        const imageURL = images[2].url;
        const picked = (selected && i === selected.index) ? "selected" : "";

        return (
          <Track key={i} className={picked} onClick={() => togglePlayback(r, i)}>
            <Artwork src={imageURL} alt={`Album artwork for ${name}`}/>
            <Details>
              <p>{name}</p>
              <Artist>by {artistStr}</Artist>
            </Details>
          </Track>
        )
      })
    )
  }

  const Picked = () => {
    if (!selected) { return null }
    console.log(selected);

    const { name, artists, album: { name: albumName, images }} = selected;
    const artistStr = artists.map(a => a.name).join(", ");
    const imageURL = images[0].url;
    return (
      <>
        <div style={{ padding: "1em 0" }}>Graph data...</div>
        <TrackData>
          <BigArtwork image={imageURL}/>
          <p>{name} by {artistStr}</p>
          <p>{albumName}</p>
        </TrackData>
        <Prompt>
          <Button>Add to Library</Button>
          <Button>Add to playlist</Button>
          <p>Leave a personal note</p>
        </Prompt>
      </>
    )
  }

  return (
    <Container>
      <Duo>
        <Half>
          <Header>I think you might like these...</Header>
          <ResultList>
            <DisplayResults/>
          </ResultList>
        </Half>
        <Half>
          <Picked/>
        </Half>
      </Duo>
      <audio ref={audioRef} src={selected.preview_url} onEnded={() => setPlaying(false)}/>
    </Container>
  )
}

export default Results;
