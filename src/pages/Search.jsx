
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import AnimateHeight from 'react-animate-height';
import { X } from 'react-feather';
import isEmpty from 'lodash/isEmpty';

import { colors, easeOutExpo } from '../theme';
import SearchBar from '../components/SearchBar';
import SpotifyItem from '../components/SpotifyItem';
import SpotifyList from '../components/SpotifyList';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import Tooltip from '../components/Tooltip';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: ${props => props.expand ? 0 : '.4em 0'};
  transition: padding .5s ${easeOutExpo};
`

const Selected = styled.div`
  flex: ${props => props.expand ? 1 : 0};
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
`

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    font-size: .7em;
    color: ${colors.light};
  }
`

const RemoveButton = styled.div`
  display: flex;
  padding: .2em;
  border-radius: .25em;
  cursor: pointer;
  transition: all .3s ${easeOutExpo};

  &:hover {
    background: ${`${colors.green}40`};
  }
`

const BackButtonWrapper = styled.div`
  margin: 1em;
`

// FIXME: Fix artwork squashing (making a new component might help?)
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
  const selectedTracks = () => (
    selected.map(({ name, artists, album: { images }}, i) => {
      const artistStr = artists.map(a => a.name).join(", ");
      const imageURL = images[1].url;

      return (
        <SpotifyItem key={i} artwork={imageURL}>
          <Details>
            <p>{name}</p>
            <span>{artistStr}</span>
          </Details>
          <RemoveButton>
            <X size={30} onClick={() => removeTrack(i)}/>
          </RemoveButton>
        </SpotifyItem>
      )
    })
  )

  return (
    <Container expand={expand}>
      <SearchBar
        spotify={spotify}
        selected={selected}
        setSelected={setSelected}
        expand={expand}
        setExpand={setExpand}
        data-tip
        data-for="searchBtn"
      />
      {!expand && (
        <Tooltip id="searchBtn">
          <p>Search through Spotify and add songs to analyze!</p>
        </Tooltip>
      )}
      <AnimateHeight height={expand ? 'auto' : 0} duration={500} animateOpacity easing={easeOutExpo}>
        <span data-tip data-for="searchNoSongsBtn">
          <Button disabled={isEmpty(selected)} action={() => extractAndRecommend(selected)}>Use these tracks!</Button>
        </span>
        {isEmpty(selected) && (
          <Tooltip id="searchNoSongsBtn" place="bottom">
            <p>Add a song first! You can add as many as you want, but 3-5 is more than enough.</p>
          </Tooltip>
        )}
      </AnimateHeight>
      <Selected expand={expand}>
        <SpotifyList>
          {selectedTracks()}
        </SpotifyList>
      </Selected>
      <AnimateHeight height={expand ? 'auto' : 0} duration={500} animateOpacity easing={easeOutExpo}>
        <BackButtonWrapper>
          <BackButton action={() => setExpand(false)}/>
        </BackButtonWrapper>
      </AnimateHeight>
    </Container>
  )
}

export default Search;
