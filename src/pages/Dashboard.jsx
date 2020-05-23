
import React, { useState } from 'react'
import styled from '@emotion/styled';
import AnimateHeight from 'react-animate-height';

import Search from './Search';

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Expandable = styled.div`
  opacity: 1;
  transition: all .5s cubic-bezier(0.25, 1, 0.5, 1), transform .6s cubic-bezier(0.25, 1, 0.5, 1);

  &.expand {
    flex: 1;
  }

  &.hide {
    /* opacity: 0; */
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
      <AnimateHeight duration={1200} animateOpacity height={expandTrackSearch ? 0 : 'auto'}>
        <Expandable className={expandTrackSearch ? "hide up" : ""}>
          <h1>Search for your songs...</h1>
        </Expandable>
      </AnimateHeight>
      {/* <button onClick={() => setPage(1)}>Search</button> */}
      {/* <AnimateHeight duration={1200} animateOpacity height={expandTrackSearch ? 0 : 'auto'}> */}
      <Expandable className={expandTrackSearch ? "expand" : ""}>
        <Search spotify={spotify} focus={() => setExpandTrackSearch(true)} extractAndRecommend={extractAndRecommend}/>
      </Expandable>
      {/* </AnimateHeight> */}
      <AnimateHeight duration={1200} animateOpacity height={expandTrackSearch ? 0 : 'auto'}>
        <Expandable className={expandTrackSearch ? "hide down" : ""}>
          <button onClick={() => setPage(2)}>Pick a playlist</button>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight duration={1200} animateOpacity height={expandTrackSearch ? 0 : 'auto'}>
        <Expandable className={expandTrackSearch ? "hide down" : ""}>
          <button onClick={useTopTracks}>Use your Top Tracks</button>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight duration={1200} animateOpacity height={expandTrackSearch ? 0 : 'auto'}>
        <Expandable className={expandTrackSearch ? "hide down" : ""}>
          <button>Use your library</button>
        </Expandable>
      </AnimateHeight>
      <AnimateHeight duration={1200} animateOpacity height={expandTrackSearch ? 0 : 'auto'}>
        <Expandable className={expandTrackSearch ? "hide down" : ""}>
          <button onClick={() => setPage(4)}>Your Music Features</button>
        </Expandable>
      </AnimateHeight>
    </Container>
  )
}

export default Dashboard;
