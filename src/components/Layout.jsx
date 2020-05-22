
import React from 'react'
import styled from '@emotion/styled';
import './index.css';

const Window = styled.div`
  position: relative;
  padding: 3em;
  height: 100vh;
  width: 100vw;
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

const Layout = ({ children }) => (
  <Window>
    <Container>
      {children}
    </Container>
  </Window>
)

export default Layout;
