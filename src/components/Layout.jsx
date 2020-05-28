
import React, { useState } from 'react'
import styled from '@emotion/styled';
import { Menu, ArrowLeft, Target } from 'react-feather';
import ReactTooltip from 'react-tooltip';

import './global.css';
import { colors, easeOutExpo } from '../theme';
import Sidebar from './Sidebar';
import Tooltip from './Tooltip';

const Window = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background: ${colors.dark};
  background: radial-gradient(circle, ${colors.dark3} 0%, ${colors.dark2} 25%, ${colors.dark} 100%);
  color: ${colors.white};
  overflow: scroll;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100%;
  width: 100%;
  max-width: 1080px;
  padding: 4em 3em;
  margin: 0 auto;
  font-size: 1.3em;
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

const Layout = ({ children, sidebar, features, back, setPage }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarElems = () => (
    <>
      <Icon top left onClick={() => setShowSidebar(true)}>
        <Menu size={36}/>
      </Icon>
      <Sidebar show={showSidebar} setShow={setShowSidebar}/>
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
        {sidebar && sidebarElems()}
      </Container>
    </Window>
  )
}

export default Layout;
