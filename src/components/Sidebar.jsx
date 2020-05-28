
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
  transition: all .5s ${easeOutExpo};
  z-index: 10;
`

const Icon = styled.div`
  position: absolute;
  top: 1em;
  left: 1em;
  cursor: pointer;
`

const Header = styled.h2`
 text-align: center;
`

const Flex = styled.div`
  flex: 1;
`

const Sidebar = ({ show, setShow }) => {
  // TODO: Allow option for deleting user data from DB
  // TODO: Add a small about section
  return (
    <>
      <Transition in={show} timeout={500} classNames="sidebar-blur">
        {state => <BlurBG state={state} onClick={() => setShow(false)}/>}
      </Transition>
      <Container show={show}>
        <Icon onClick={() => setShow(false)}><X size={36}/></Icon>
        <Header>What is Wandering?</Header>
        <Flex>
          <p>Wandering is a small web app that recommends you to songs to listen to, based on what kind of music you listen to or search for!</p>
        </Flex>
        <p><em>made by a clueless danny</em></p>
      </Container>
    </>
  )
}

export default Sidebar;
