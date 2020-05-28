
import React, { useState } from 'react'
import styled from '@emotion/styled';
import AnimateHeight from 'react-animate-height';

import Search from './Search';
import Button from '../components/Button';
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

// TODO: Add hover tooltips to buttons
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
            <Button action={() => setPage(2)}>Pick from your playlists</Button>
          </Expandable>
        </AnimateHeight>
        <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
          <Expandable className={toggleDown}>
            <Button action={useTopTracks}>Use your Top Tracks</Button>
          </Expandable>
        </AnimateHeight>
        <AnimateHeight height={toggleHide} duration={1000} animateOpacity easing={easeOutExpo}>
          <Expandable className={toggleDown}>
            <Button action={useLibrary}>Use your whole library</Button>
          </Expandable>
        </AnimateHeight>
      </ButtonContainer>
    </Container>
  )
}

export default Dashboard;
