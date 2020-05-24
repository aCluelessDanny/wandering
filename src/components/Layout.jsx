
import React from 'react'
import styled from '@emotion/styled';
import { Menu, ArrowLeft, Target } from 'react-feather';

import './global.css';
import { colors } from '../theme';

const Window = styled.div`
  position: relative;
  padding: 4em 3em;
  height: 100vh;
  width: 100vw;
  background: ${colors.dark};
  background: radial-gradient(circle, ${colors.dark3} 0%, ${colors.dark2} 25%, ${colors.dark} 100%);
  color: ${colors.white};
  overflow: hidden;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  font-size: 1.3em;
`

const Icon = styled.div`
  position: ${props => props.absolute ? 'absolute' : 'static'};
  top: 1em;
  left: ${props => props.left ? '1em' : 'initial'};
  right: ${props => props.right ? '1em' : 'initial'};
  cursor: pointer;
`

const Layout = ({ children, features, setPage }) => (
  <Window>
    <Container>
      <Icon absolute top left><Menu size={36}/></Icon>
      {features && <Icon absolute top right><Target size={36}/></Icon>}
      {children}
    </Container>
  </Window>
)

export default Layout;
