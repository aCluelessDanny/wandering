
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import AnimateHeight from 'react-animate-height';
import isEmpty from 'lodash/isEmpty';

import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import { colors, easeOutExpo } from '../theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`

const Selected = styled.div`
  flex: ${props => props.expand ? 1 : 0};
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`

const Track = styled.div`
  display: flex;
  align-items: center;
  min-height: 50px;
  width: 100%;
  padding: 4px .5em;
  border-radius: 8px;
  cursor: pointer;
  background: ${colors.white};
  color: ${colors.dark};

  & + & {
    margin-top: 4px;
  }
`

const Artwork = styled.img`
  height: 50px;
  margin: 0 8px 0 4px;
`

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    font-size: .7em;
    color: ${colors.dark2};
  }
`

const Search = ({ spotify, expand, setExpand, extractAndRecommend }) => {
  // STATE
  const [selected, setSelected] = useState([]);

  // EFFECTS
  // Reset selection upon exiting
  useEffect(() => {
    if (!expand) {
      setSelected([]);
    }
  }, [expand])

  // Remove tracks from selection
  const removeTrack = (index) => {
    let tracks = [...selected];
    tracks.splice(index, 1);
    setSelected(tracks);
  }

  // COMPONENTS
  const SelectedTracks = () => (
    selected.map(({ name, artists, album: { images }}, i) => {
      const artistStr = artists.map(a => a.name).join(", ");
      const imageURL = images[2].url;

      return (
        <Track key={i} onClick={() => removeTrack(i)}>
          <Artwork src={imageURL} alt={`Album artwork for ${name}`}/>
          <Details>
            <p>{name}</p>
            <span>by {artistStr}</span>
          </Details>
        </Track>
      )
    })
  )

  return (
    <Container>
      <SearchBar spotify={spotify} selected={selected} setSelected={setSelected} expand={expand} setExpand={setExpand}/>
      <AnimateHeight height={expand ? 'auto' : 0} duration={500} animateOpacity easing={easeOutExpo}>
        <Button disabled={isEmpty(selected)} action={() => extractAndRecommend(selected)}>Use these tracks!</Button>
      </AnimateHeight>
      <Selected expand={expand}>
        <SelectedTracks/>
      </Selected>
      <AnimateHeight height={expand ? 'auto' : 0} duration={500} animateOpacity easing={easeOutExpo}>
        <BackButton action={() => setExpand(false)}/>
      </AnimateHeight>
    </Container>
  )
}

export default Search;
