
import React from 'react'
import styled from '@emotion/styled';
import { Transition } from 'react-transition-group';
import { X } from 'react-feather';

import { colors, easeOutExpo } from '../theme';

const BlurBG = styled.div`
  display: ${({ state }) => state === "exited" ? "none" : "initial"};
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: ${({ state }) => (state === "entering" || state === "entered") ? 1 : 0};
  background: #0005;
  backdrop-filter: blur(3px);
  z-index: 9;
  transition: opacity .5s ${easeOutExpo};
`

const Container = styled.div`
  position: absolute;
  top: 0;
  left: ${props => props.show ? 0 : "-600px"};
  bottom: 0;
  width: 600px;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  padding: 3em 2em 2em;
  background: ${colors.dark3};
  color: ${colors.white};
  text-align: center;
  transition: all .5s ${easeOutExpo};
  z-index: 10;
`

const Icon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 1em;
  cursor: pointer;
  transition: all 0.5s ${easeOutExpo};

  &:hover {
    padding: 1.25em 1em 1em 1.25em;
  }
`

const Header = styled.h2`
  margin-bottom: .5em;
  font-style: italic;
`

const Flex = styled.div`
  flex: 1;

  * + * {
    margin-top: .25em;
  }
`

const Endpoints = styled.div`
  text-align: center;
  font-style: italic;

  span {
    font-size: .7em;
    color: ${colors.light};
  }
`

const Sidebar = ({ show, setShow }) => {
  // TODO: Allow option for deleting user data from DB
  return (
    <>
      <Transition in={show} timeout={500} classNames="sidebar-blur">
        {state => <BlurBG state={state} onClick={() => setShow(false)}/>}
      </Transition>
      <Container show={show}>
        <Icon onClick={() => setShow(false)}><X size={36}/></Icon>
        <Header>The heck is Wandering?</Header>
        <Flex>
          <p>
            <b>Wandering</b> is a small web app that recommends you songs, based on what kind of music you listen to!
          </p>
          <p>
            Spotify has some special endpoints in their API that gives data about a track's <em>musical features</em>, such as how upbeat or energetic a track is. So Wandering takes advantage of that to predict your tastes and finds songs that you'll hopefully like to discover.
          </p>
          <p>
            <em>Go wild!</em>
          </p>
        </Flex>
        <Endpoints>
          <p>made by a clueless danny</p>
          <p><span>Hosted on Vercel Now</span></p>
        </Endpoints>
      </Container>
    </>
  )
}

export default Sidebar;
