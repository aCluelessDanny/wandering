
import React, { useState } from 'react'
import styled from '@emotion/styled';
import { Menu, ArrowLeft, Target } from 'react-feather';

import './global.css';
import { colors, easeOutExpo } from '../theme';
import Sidebar from './Sidebar';

const Window = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background: ${colors.dark};
  background: radial-gradient(circle, ${colors.dark3} 0%, ${colors.dark2} 25%, ${colors.dark} 100%);
  color: ${colors.white};
  font-size: 1.3em;
  overflow: scroll;

  @media screen and (max-width: 820px) {
    font-size: 1.2em;
  }
`

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: calc(100% - 7em);
  min-height: calc(100vh - 7em);
  width: 100%;
  max-width: 1080px;
  padding: 0 2em;
  margin: 4em auto 3em;

  @media screen and (max-width: 820px) {
    height: calc(100% - 6em);
    min-height: calc(100% - 6em);
    margin: 3em auto 1em;
  }
`

const Icon = styled.div`
  position: fixed;
  top: 0;
  left: ${props => props.left ? '0' : 'initial'};
  right: ${props => props.right ? '0' : 'initial'};
  padding: 1em;
  cursor: pointer;
  transition: all .5s ${easeOutExpo};

  &:hover {
    padding: ${props => props.left ? '1.25em 1em 1em 1.25em' : '1.25em 1.25em 1em 1em'};
  }
`

const Layout = ({ children, spotify, sidebar, features, back, setPage }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarElems = () => (
    <>
      <Icon top left onClick={() => setShowSidebar(true)}>
        <Menu size={36}/>
      </Icon>
      <Sidebar spotify={spotify} show={showSidebar} setShow={setShowSidebar}/>
    </>
  )

  return (
    <Window>
      <Container>
        {features && (
          <Icon top right onClick={() => setPage(4)}>
            <Target size={36}/>
          </Icon>
        )}
        {back && (
          <Icon top right onClick={() => setPage(0)}>
            <ArrowLeft size={36}/>
          </Icon>
        )}
        {children}
      </Container>
      {sidebar && sidebarElems()}
    </Window>
  )
}

export default Layout;
