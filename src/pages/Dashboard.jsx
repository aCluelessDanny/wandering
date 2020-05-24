
import React, { useState } from 'react'
import styled from '@emotion/styled';
import AnimateHeight from 'react-animate-height';

import Search from './Search';
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

  &.hide.up {
    transform: translateY(-150%);
  }

  &.hide.down {
    transform: translateY(150%);
  }
`

const Dashboard = ({ setPage, useTopTracks, spotify, extractAndRecommend }) => {
  const [expandTrackSearch, setExpandTrackSearch] = useState(false);

  return (
    <Container>
      <AnimateHeight height={expandTrackSearch ? 0 : 'auto'} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={expandTrackSearch ? "hide up" : ""}>
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
        <Expandable className={expandTrackSearch ? "hide down" : ""}>
          <Button click={() => setPage(2)}>Pick a playlist</Button>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight height={expandTrackSearch ? 0 : 'auto'} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={expandTrackSearch ? "hide down" : ""}>
          <Button click={useTopTracks}>Use your Top Tracks</Button>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight height={expandTrackSearch ? 0 : 'auto'} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={expandTrackSearch ? "hide down" : ""}>
          <Button>Pick your library</Button>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight height={expandTrackSearch ? 0 : 'auto'} duration={1000} animateOpacity easing={easeOutExpo}>
        <Expandable className={expandTrackSearch ? "hide down" : ""}>
          <Button click={() => setPage(4)}>Your Music Features</Button>
        </Expandable>
      </AnimateHeight>
    </Container>
  )
}

export default Dashboard;
