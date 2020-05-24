
import React, { useState } from 'react'
import styled from '@emotion/styled';
import AnimateHeight from 'react-animate-height';

import Search from './Search';
import Playlists from './Playlists';
import Button from '../components/Button';
import { easeOutExpo } from '../theme';

const Container = styled.div`
  display: flex;
  height: 100%;
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

const Dashboard = ({ setPage, useTopTracks, spotify, extractAndRecommend }) => {
  const [expandTrackSearch, setExpandTrackSearch] = useState(false);

  const toggleHide = expandTrackSearch ? 0 : 'auto';
  const toggleUp = expandTrackSearch ? "up" : "";
  const toggleDown = expandTrackSearch ? "down" : "";

  return (
    <Container>
      <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={toggleUp}>
          <h1>Search for your songs...</h1>
        </Expandable>
      </AnimateHeight>
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
          <Button click={() => setPage(2)}>Pick from your playlists</Button>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={toggleDown}>
          <Button click={useTopTracks}>Use your Top Tracks</Button>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={toggleDown}>
          <Button>Pick your library</Button>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={toggleDown}>
          <Button click={() => setPage(4)}>Your Music Features</Button>
        </Expandable>
      </AnimateHeight>
    </Container>
  )
}

export default Dashboard;
