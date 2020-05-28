
import React, { useState } from 'react'
import styled from '@emotion/styled';
import AnimateHeight from 'react-animate-height';

import Search from './Search';
import Button from '../components/Button';
import Tooltip from '../components/Tooltip';
import { easeOutExpo } from '../theme';

const Container = styled.div`
  display: flex;
  height: 100%;
  max-width: 600px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Expandable = styled.div`
  opacity: 1;
  transition: all .5s ${easeOutExpo}, transform .6s ${easeOutExpo};

  &.expand {
    flex: 1;
  }

  &.up {
    transform: translateY(-150%);
  }

  &.down {
    transform: translateY(150%);
  }
`

const Header = styled.h1`
  text-align: center;
`

const Paragraph = styled.p`
  text-align: center;
`

const ButtonContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > div {
    margin: .3em 0;
  }
`

const buttonDescription = {
  playlists: <p>Search through your playlists and pick any songs you like.</p>,
  topTracks: <p>Use your top tracks in the past few weeks, according to Spotify.</p>,
  library: (
    <>
      <p>Use your entire Spotify library!</p>
      <p><b>Warning:</b> This may take a bit and is prone to rate limiting...</p>
    </>
  )
}

const Dashboard = ({ setPage, useTopTracks, useLibrary, spotify, extractAndRecommend }) => {
  const [expandTrackSearch, setExpandTrackSearch] = useState(false);

  const toggleHide = expandTrackSearch ? 0 : 'auto';
  const toggleUp = expandTrackSearch ? "up" : "";
  const toggleDown = expandTrackSearch ? "down" : "";

  return (
    <Container>
      <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={toggleUp}>
          <Header>Pick some songs!</Header>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={toggleUp}>
          <Paragraph>
            Wandering needs some songs to recommend with. Pick a method below to do just that:
          </Paragraph>
        </Expandable>
      </AnimateHeight>
      <ButtonContainer>
        <Expandable className={expandTrackSearch ? "expand" : ""}>
          <Search
            spotify={spotify}
            expand={expandTrackSearch}
            setExpand={setExpandTrackSearch}
            extractAndRecommend={extractAndRecommend}
          />
        </Expandable>
        <AnimateHeight height={expandTrackSearch ? 0 : 'auto'} duration={1000} animateOpacity easing={easeOutExpo}>
          <Expandable className={expandTrackSearch ? "down" : ""}>
            <Button data-tip data-for="playlistBtn" action={() => setPage(2)}>Pick from your playlists</Button>
            <Tooltip id="playlistBtn">{buttonDescription.playlists}</Tooltip>
          </Expandable>
        </AnimateHeight>
        <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
          <Expandable className={toggleDown}>
            <Button data-tip data-for="topTracksBtn" action={useTopTracks}>Use your Top Tracks</Button>
            <Tooltip id="topTracksBtn">{buttonDescription.topTracks}</Tooltip>
          </Expandable>
        </AnimateHeight>
        <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
          <Expandable className={toggleDown}>
            <Button data-tip data-for="libraryBtn" action={useLibrary}>Use your whole library</Button>
            <Tooltip id="libraryBtn">{buttonDescription.library}</Tooltip>
          </Expandable>
        </AnimateHeight>
      </ButtonContainer>
    </Container>
  )
}

export default Dashboard;
